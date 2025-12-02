import { app, BrowserWindow, ipcMain, desktopCapturer, nativeImage, screen, Tray, Menu, powerMonitor } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import Store from "electron-store";
import { BASE_API_URL } from './data.js';

let tray = null;
let win = null;
let isResumedFromSleep = false;

const store = new Store();

// --- Store IPC Handlers ---
ipcMain.handle("store:set", (event, key, value) => {
    store.set(key, value);
    return true;
});

ipcMain.handle("store:get", (event, key) => {
    return store.get(key);
});

ipcMain.handle("store:delete", (event, key) => {
    store.delete(key);
    return true;
});


// --- Asynchronous Logout Function ---
const handleLogout = async () => {
    const user = store.get('user');
    // FIX 1: Add a check for user._id before proceeding, as it's used in the URL
    if (!user || !user._id) { 
        console.warn("Logout attempted, but user or user ID is missing in store.");
        return;
    }
    // FIX 2: Only check if user.login is explicitly the string 'false' or not present
    if (user.login === 'false') return;

    const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}api/login/out/${user._id}`,
        headers: {}
    };

    try {
        await axios.request(config);
        console.log(`User ${user._id} logged out successfully.`);
        // Ensure the store reflects that the user is logged out after a successful request
        store.set('user.login', 'false');
    } catch (error) {
        // Log the error but crucially, DO NOT re-throw or fail the promise chain.
        // This ensures the main window's 'close' handler can proceed with app.quit() 
        // even if the API call fails (like your 404 error).
        console.error("Error during logout request:", error.response ? `Request failed with status code ${error.response.status}` : error.message);
        
        // OPTIONAL: If the request fails, assume the user is logged out client-side anyway
        // to prevent repeated failed calls.
        store.set('user.login', 'false'); 
    }
}

ipcMain.on("message", (event, msg) => {
    console.log("receiving data from react: ", msg);
    isResumedFromSleep = msg;
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Screen Capture IPC Handler ---
ipcMain.handle('capture-screen', async () => {
    const { width, height } = screen.getPrimaryDisplay().size;

    const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: { width, height }
    });

    const primarySource = sources[0];

    // ORIGINAL full-size PNG buffer
    const originalBuffer = primarySource.thumbnail.toPNG();

    // CREATE nativeImage from the original buffer
    const img = nativeImage.createFromBuffer(originalBuffer);

    // RESIZE & COMPRESS
    const resized = img
        .resize({ width: 1280 }) // shrink width → auto adjust height
        .toJPEG(60); // 60% quality (PNG does not have “quality”, JPEG does)

    // Convert resized compressed image to Base64
    const base64 = nativeImage.createFromBuffer(resized).toDataURL();

    return base64;
});

function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            // devTools: false,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
    } else {
        const indexPath = path.join(__dirname, '../dist-react/index.html');
        win.loadFile(indexPath);
    }

    win.on("close", async (event) => {
        if (app.isQuiting) {
            // 1. Prevent the window from closing immediately to allow async task to run
            event.preventDefault();
            console.log("Awaiting asynchronous logout before quitting...");

            // 2. Wait for the logout request to complete
            await handleLogout();

            updateReactStateFromMain('false');

            // 3. Cleanup: Destroy the tray icon
            if (tray) { 
                tray.destroy();
                tray = null;
            }
            
            // 4. FINAL FIX: Forcibly exit the process to ensure no background console threads remain.
            process.exit(0);
            
            return;
        }

        // Default action when closing the window (minimizing to tray)
        event.preventDefault();
        win.hide();
        console.log("windows is hiding in tray");
    });
}
function updateReactStateFromMain(data) {
    if (!win || !win.webContents) return;
    win.webContents.send('update-data', data);
}

app.whenReady().then(() => {
    createWindow();

    // Initialize tray with icon
    // NOTE: Ensure 'icon.png' exists in the build directory for production
    tray = new Tray(path.join(__dirname, "icon.png"));

    const trayMenu = Menu.buildFromTemplate([
        { label: "Open App", click: () => win.show() },
        {
            label: "Quit Completely", click: () => {
                app.isQuiting = true;
                // We will handle the actual exit inside win.on('close')
                win.close(); 
            }
        }
    ]);

    tray.setToolTip("Employee Monitoring App");
    tray.setContextMenu(trayMenu);
    tray.on("click", () => {
        win.show();
        win.focus();
    });

    // --- Power Monitor Event Handlers ---
    
    // System going to sleep/suspend
    powerMonitor.on("suspend", () => {
        console.log("System is going to sleep");
        isResumedFromSleep = false;
        // Best practice to log out when the system is suspended
        handleLogout(); 
    });

    // Screen locked
    powerMonitor.on("lock-screen", () => {
        console.log("System is locked");
        store.set("pendingStatus", "false");
        // Best practice to log out when the screen is locked
        handleLogout();
    });

    // System resumed from sleep
    powerMonitor.on("resume", () => {
        console.log("isResumedFromSleep: ", isResumedFromSleep)
        function isRendererResumed() {
            if (isResumedFromSleep) {
                // Inform renderer to check state and possibly log out/stop tracking
                updateReactStateFromMain('false'); 
                console.log("Screen resumed from sleep");
                win.show();
                return;
            }
            // Keep checking until the renderer communicates back or timeout (500ms check)
            setTimeout(() => {
                isRendererResumed();
            }, 500);
        }
        isRendererResumed();
    });

    // Screen unlocked
    powerMonitor.on("unlock-screen", () => {
        const flag = store.get("pendingStatus");
        console.log("Screen unlocked: ", flag);
        if (flag) {
            // Restore previous working state if pending
            updateReactStateFromMain(flag);
            store.delete("pendingStatus");
        }
        win.show();
    });
});

app.on('window-all-closed', () => {
    // Standard Electron behavior: Quit the application when all windows are closed,
    // except on macOS (where applications keep running until the user quits explicitly).
    if (process.platform !== 'darwin') {
        // Forcibly exit the process to ensure no background threads remain
        process.exit(0);
    }
});