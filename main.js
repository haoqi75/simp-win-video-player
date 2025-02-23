const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: 'icon.ico',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');

    // 创建菜单
    const menuTemplate = [
        {
            label: '文件',
            submenu: [
                {
                    label: '打开视频文件',
                    click: () => {
                        dialog.showOpenDialog({
                            properties: ['openFile'],
                            filters: [
                                { name: '视频文件', extensions: ['mp4', 'mkv', 'avi'] }
                            ]
                        }).then(result => {
                            if (!result.canceled && result.filePaths.length > 0) {
                                // 发送文件路径到渲染进程
                                mainWindow.webContents.send('selected-file', result.filePaths[0]);
                                console.log('Selected file:', result.filePaths[0]); // 调试日志
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                },
                { type: 'separator' },
                {
                    label: '退出',
                    role: 'quit'
                }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        const aboutWindow = new BrowserWindow({
                            width: 400,
                            height: 300,
                            resizable: false,
                            parent: mainWindow,
                            modal: true
                        });
                        aboutWindow.loadFile('about.html');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

if (require('electron-squirrel-startup')) {
    app.quit();
  }
  
  const { createShortcut } = require('electron-squirrel-startup');
  
  app.on('ready', () => {
    if (process.argv.includes('--squirrel-firstrun')) {
      createShortcut({
        target: process.execPath,
        name: '视频播放器',
        description: '视频播放器'
      });
    }
  });