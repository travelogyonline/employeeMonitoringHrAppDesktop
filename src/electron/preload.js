const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    sendMessage: (msg) => ipcRenderer.send("message", msg),
    onMessage: (callback) => ipcRenderer.on("reply", callback),
    captureScreen: () => ipcRenderer.invoke('capture-screen'),
    sendToMain: (channel, data) => ipcRenderer.send(channel, data),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
});

contextBridge.exposeInMainWorld("electronStore", {
  set: (key, value) => ipcRenderer.invoke("store:set", key, value),
  get: (key) => ipcRenderer.invoke("store:get", key),
  delete: (key) => ipcRenderer.invoke("store:delete", key),
});