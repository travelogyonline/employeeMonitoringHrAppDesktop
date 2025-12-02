const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (msg) => ipcRenderer.send("message", msg),
  onMessage: (callback) => ipcRenderer.on("reply", callback),
  captureScreen: () => ipcRenderer.invoke('capture-screen'),
  sendToMain: (channel, data) => ipcRenderer.send(channel, data),
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  onUpdateData: (callback) => {
    const wrapped = (event, data) => callback(data);
    ipcRenderer.on("update-data", wrapped);
    return () => {
      ipcRenderer.removeListener("update-data", wrapped);
    };
  },
  rendererReady: () => ipcRenderer.send('renderer-ready'),
});

contextBridge.exposeInMainWorld("electronStore", {
  set: (key, value) => ipcRenderer.invoke("store:set", key, value),
  get: (key) => ipcRenderer.invoke("store:get", key),
  delete: (key) => ipcRenderer.invoke("store:delete", key),
});