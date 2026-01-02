import { app, BrowserWindow, Notification, ipcMain, desktopCapturer, nativeImage, screen, Tray, Menu, powerMonitor } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import Store from "electron-store";
import { BASE_API_URL } from './data.js';

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (win) {
            if (win.isMinimized()) win.restore();
            win.show();
            win.focus();
        }
    });
}

let tray = null;
let win = null;
let isResumedFromSleep = false;
let isWindowFocused = true;
let loginStatus = 'false';

function updateWindowByLoginStatus(status) {
    if (!win) return;

    if (status === 'false') {
        // 🔒 Force fullscreen when logged out
        win.setFullScreen(true);
        win.setAlwaysOnTop(true, 'screen-saver');
        win.show();
        win.focus();
    } else {
        // 🔓 Normal mode when logged in
        win.setFullScreen(false);
        win.setAlwaysOnTop(false);
        win.maximize();
    }
}


ipcMain.on("loginStatus", (event, msg) => {
    loginStatus = msg;
    console.log("Status from React UI:", msg);

    updateWindowByLoginStatus(msg);
});


const store = new Store();

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

function startIdleChecker() {
    const IDLE_LIMIT = 5 * 60; // 5 minutes (in seconds)
    // const IDLE_LIMIT = 3; // 15 minutes (in seconds)

    setInterval(() => {
        const idle = powerMonitor.getSystemIdleTime();

        if (idle >= IDLE_LIMIT) {
            updateReactStateFromMain(`You are on break, because your system remain Idle for ${IDLE_LIMIT / 60} minutes`);
            handleLogout();
            win.setFullScreen(true);
            win.setAlwaysOnTop(true, 'screen-saver');
            win.focus();
            win.show();
        }
    }, 5 * 1000); // check every 5 seconds
}


const handleLogout = async () => {
    const user = store.get('user');
    if (!user || !user._id) {
        console.warn("Logout attempted, but user or user ID is missing in store.");
        return;
    }
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
        store.set('user.login', 'false');
    } catch (error) {
        console.error("Error during logout request:", error.response ? `Request failed with status code ${error.response.status}` : error.message);
        store.set('user.login', 'false');
    }
}

ipcMain.on("message", (event, msg) => {
    console.log("receiving data from react: ", msg);
    isResumedFromSleep = msg;
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ipcMain.handle('capture-screen', async () => {
    const { width, height } = screen.getPrimaryDisplay().size;

    const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: { width, height }
    });

    const primarySource = sources[0];

    const originalBuffer = primarySource.thumbnail.toPNG();

    const img = nativeImage.createFromBuffer(originalBuffer);

    const resized = img
        .resize({ width: 1280 })
        .toJPEG(60);
    const base64 = nativeImage.createFromBuffer(resized).toDataURL();

    return base64;
});


function createWindow() {
    win = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (loginStatus === 'false') {
        win.setFullScreen(true);
    } else {
        win.maximize();
    }

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
    } else {
        const indexPath = path.join(__dirname, '../dist-react/index.html');
        win.loadFile(indexPath);
    }

    win.on("close", async (event) => {
        if (app.isQuiting) {
            event.preventDefault();
            console.log("Awaiting asynchronous logout before quitting...");

            await handleLogout();

            updateReactStateFromMain('false');

            if (tray) {
                tray.destroy();
                tray = null;
            }

            process.exit(0);

            return;
        }
        event.preventDefault();
        win.hide();
        console.log("windows is hiding in tray");
    });
}
function updateReactStateFromMain(data) {
    if (!win || !win.webContents) return;
    win.webContents.send('update-data', data);
}

app.whenReady().then(async () => {
    createWindow();
    win.on("focus", () => {
        isWindowFocused = true;
    })
    win.on("blur", () => {
        isWindowFocused = false;
    })
    console.log("path: ", process.execPath)
    tray = new Tray(path.join(__dirname, "icon.png"));

    const trayMenu = Menu.buildFromTemplate([
        { label: "Open App", click: () => win.show() },
        {
            label: "Quit Completely", click: () => {
                app.isQuiting = true;
                win.close();
            }
        }
    ]);

    startIdleChecker();

    tray.setToolTip("Employee Monitoring App");
    tray.setContextMenu(trayMenu);
    tray.on("click", () => {
        win.show();
        win.focus();
    });

    powerMonitor.on("shutdown", async (event) => {
        console.log("System shutdown detected");

        // Delay shutdown (VERY IMPORTANT)
        event.preventDefault();

        // Bring app to front
        if (win) {
            win.show();
            win.focus();
            win.setAlwaysOnTop(true, "screen-saver");
        }

        // Force logout
        await handleLogout();
        updateReactStateFromMain('false');

        // Small delay so API completes
        setTimeout(() => {
            app.isQuiting = true;
            app.quit(); // Allow shutdown to continue
        }, 2000);
    });

    powerMonitor.on("suspend", async () => {
        console.log("System is going to sleep");
        isResumedFromSleep = false;
        await handleLogout();
    });

    powerMonitor.on("lock-screen", async () => {
        console.log("System is locked");
        store.set("pendingStatus", "true");
        await handleLogout();
    });

    powerMonitor.on("resume", () => {
        function isRendererResumed() {
            console.log("isResumedFromSleep: ", isResumedFromSleep)
            if (isResumedFromSleep) {
                updateReactStateFromMain("You are on break, because your system went on Sleep");
                console.log("Screen resumed from sleep");
                win.setFullScreen(true);
                win.setAlwaysOnTop(true, 'screen-saver');
                win.show();
                win.focus();
                setTimeout(() => {
                    win.setAlwaysOnTop(false);
                }, 100);
                return;
            }
            setTimeout(() => {
                isRendererResumed();
            }, 500);
        }
        isRendererResumed();
    });

    powerMonitor.on("unlock-screen", () => {
        const flag = store.get("pendingStatus");
        console.log("Screen unlocked: ", flag);
        if (flag) {
            updateReactStateFromMain("You are on break, Because you locked your screen!");
            store.delete("pendingStatus");
        }
        win.show();
    });
});

ipcMain.on("show-notification", (event, payload) => {
    // if (isWindowFocused) return; // ✅ BLOCK notification

    if (!Notification.isSupported()) return;

    console.log("payload: ", payload)

    const notification = new Notification({
        title: payload.title,
        body: payload.body
    });

    notification.show();

    notification.on("click", () => {
        win.show();
        win.focus();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        process.exit(0);
    }
});