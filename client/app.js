const {app, BrowserWindow, ipcMain} = require('electron')
const url = require("url");
const path = require("path");
const deviceInformation = require('./service/deviceinformation')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/electron-app/browser/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools({mode: "detach"})

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  ipcMain.handle('device-info', () =>  {
    let test = new deviceInformation();
    return test.deviceList()
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
