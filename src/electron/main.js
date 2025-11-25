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



const handleLogout = () => {
    const user = store.get('user');
    if (!user) return;
    if (user.login === 'false') return;

    const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}api/login/out/${user._id}`,
        headers: {}
    };

    axios.request(config)
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

    win.on("close", (event) => {
        if (app.isQuiting) {
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

app.whenReady().then(() => {
    createWindow();

    tray = new Tray(path.join(__dirname, "icon.png"));

    const trayMenu = Menu.buildFromTemplate([
        { label: "Open App", click: () => win.show() },
        {
            label: "Quit Completely", click: () => {
                handleLogout();
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

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
                win.show();
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

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});