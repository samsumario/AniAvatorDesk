const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getCpuProcess: () => ipcRenderer.invoke('cpu:process'),
    getDirname: () => ipcRenderer.invoke('util')
});