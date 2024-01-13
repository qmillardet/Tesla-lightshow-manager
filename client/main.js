const { app, BrowserWindow, ipcMain } = require('electron')
// inclusion du chemin du module Node.js au tout début de votre fichier
const path = require('node:path')

const deviceInformation = require('./service/deviceinformation')

// modification de votre fonction existante createWindow()
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
    win.webContents.openDevTools({'mode' : "detach"})
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.xgetAllWindows().length === 0) createWindow()
    })

    ipcMain.handle('ping', () => 'pong')
    ipcMain.handle('device-info', () =>  {
        let test = new deviceInformation();
        return test.deviceList()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})