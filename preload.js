const { contextBridge, ipcRenderer } = require('electron');

// 暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    onSelectedFile: (callback) => ipcRenderer.on('selected-file', callback)
});

console.log('Preload script loaded'); // 调试日志