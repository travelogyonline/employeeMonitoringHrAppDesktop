import { app, BrowserWindow, ipcMain, desktopCapturer, nativeImage, screen, Tray, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

let tray = null;
let win = null;
let user = null;

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
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
