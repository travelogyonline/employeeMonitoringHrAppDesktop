import { app, BrowserWindow, ipcMain, desktopCapturer, nativeImage, screen, Tray, Menu, powerMonitor } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import Store from "electron-store";
import {BASE_API_URL} from './data.js';

let tray = null;
let win = null;
let user = null;

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
    if(!user) return;
    console.log("user: ",user)
    const {userId} = user;
    const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}api/login/out/${userId}`,
        headers: {}
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            isAuthenticated(false)
        })
        .catch((error) => {
            console.log(error);
        });
}

ipcMain.on("react-message", (event, data) => {
    user = data;
    console.log("Received from React:", data);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ipcMain.handle('capture-screen', async () => {
    const { width, height } = screen.getPrimaryDisplay().size;
    const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: { width, height }   // FULL SIZE
    });

    // Get first screen
    const primarySource = sources[0];

    const thumbnail = primarySource.thumbnail.toPNG();

    // Return image as base64 to React
    const imageBase64 = nativeImage.createFromBuffer(thumbnail).toDataURL();
    return imageBase64;
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
        },
    });

    if (process.env.NODE_ENV === 'development') {
        // Load React dev server
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        // Load production build
        const indexPath = path.join(__dirname, '../dist-react/index.html');
        win.loadFile(indexPath);
    }

    // Instead of closing the app → hide to tray
    win.on("close", (event) => {
        if (app.isQuiting) {
            return;
        }

        // Otherwise → hide to tray instead of closing
        event.preventDefault();
        win.hide();
    });
}

app.whenReady().then(() => {
    createWindow();

    tray = new Tray(path.join(__dirname, "icon.png"));  // Add your tray icon here

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
    });

    // When system is locked
    powerMonitor.on("lock-screen", () => {
        console.log("System is locked");
    });

    // Optional: when system wakes or unlocks
    powerMonitor.on("resume", () => {
        console.log("System resumed");
        win.show();
    });

    powerMonitor.on("unlock-screen", () => {
        console.log("Screen unlocked");
        win.show();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
