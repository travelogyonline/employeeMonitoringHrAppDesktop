import { app, BrowserWindow } from 'electron'
import path from 'path';

// Disable GPU hardware acceleration
// app.disableHardwareAcceleration();

app.on('ready', () =>{
    const mainWindow = new BrowserWindow({});
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
})