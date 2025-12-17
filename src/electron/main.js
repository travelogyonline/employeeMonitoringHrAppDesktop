import { app, BrowserWindow, Notification, ipcMain, desktopCapturer, nativeImage, screen, Tray, Menu, powerMonitor } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import Store from "electron-store";
import { BASE_API_URL } from './data.js';
import AutoLaunch from "auto-launch";
import Registry from "winreg";

let tray = null;
let win = null;
let isResumedFromSleep = false;
let isWindowFocused = true;

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
    const IDLE_LIMIT = 15 * 60;
    // const IDLE_LIMIT = 5;

    setInterval(() => {
        const idle = powerMonitor.getSystemIdleTime();

        if (idle >= IDLE_LIMIT) {
            updateReactStateFromMain('false');
            handleLogout();
            win.setAlwaysOnTop(true, 'screen-saver');
            win.focus();
            win.show();
            setTimeout(() => {
                win.setAlwaysOnTop(false);
            }, 100);
        }

    }, 60 * 1000); // check every 10 seconds
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
        // width: 900,
        // height: 600,
        // fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            // devTools: false,
        },
    });

    win.maximize();

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

function getWindowsStartupPath(appName) {
    return new Promise((resolve, reject) => {
        const regKey = new Registry({
            hive: Registry.HKCU,
            key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
        });

        regKey.get(appName, (err, item) => {
            if (err || !item) return resolve(null);
            resolve(item.value);
        });
    });
}

app.whenReady().then(async () => {
    const appName = "Travel Buddy";
    const currentExePath = process.execPath;

    const appLauncher = new AutoLaunch({
        name: appName,
        path: currentExePath,
    });

    // Read existing registry startup value
    const startupPath = await getWindowsStartupPath(appName);

    if (!startupPath || startupPath.replace(/"/g, '') !== currentExePath) {
        console.log("Startup path changed or missing → fixing auto-launch...");
        try {
            await appLauncher.enable();
            console.log("Auto-launch updated successfully.");
        } catch (err) {
            console.error("Failed to update auto-launch:", err);
        }
    } else {
        console.log("Auto-launch path correct.");
    }
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
    powerMonitor.on("suspend", () => {
        console.log("System is going to sleep");
        isResumedFromSleep = false;
        handleLogout();
    });

    powerMonitor.on("lock-screen", () => {
        console.log("System is locked");
        store.set("pendingStatus", "false");
        handleLogout();
    });

    powerMonitor.on("resume", () => {
        console.log("isResumedFromSleep: ", isResumedFromSleep)
        function isRendererResumed() {
            if (isResumedFromSleep) {
                updateReactStateFromMain('false');
                console.log("Screen resumed from sleep");
                win.setAlwaysOnTop(true, 'screen-saver');
                win.focus();
                win.show();
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
            updateReactStateFromMain(flag);
            store.delete("pendingStatus");
        }
        win.show();
    });
});

ipcMain.on("show-notification", (event, payload) => {
    if (isWindowFocused) return; // ✅ BLOCK notification

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