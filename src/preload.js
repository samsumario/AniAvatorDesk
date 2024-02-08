const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => ipcRenderer.invoke('read:config'),
    getCpuProcess: () => ipcRenderer.invoke('cpu:process'),
    getDirname: () => ipcRenderer.invoke('util')
});