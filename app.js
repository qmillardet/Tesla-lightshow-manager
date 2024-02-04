const {app, BrowserWindow, ipcMain} = require('electron')
const url = require("url");
const path = require("path");
const deviceInformation = require('./service/deviceinformation')
const LightshowService = require('./service/LightshowService')
const CopyManagerService = require("./service/CopyManagerService");
const environnement = process.env.ENV_NAME || 'prod';

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
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
  if (environnement === 'dev'){
    // Open the DevTools.
    let mode  = process.env.DEV_MODE || 'detach';
    mainWindow.webContents.openDevTools({mode: mode})
  }


  mainWindow.on('closed', function () {
    mainWindow = null
  })

  ipcMain.handle('device-info', () =>  {
    let test = new deviceInformation();
    return test.deviceList()
  })

  ipcMain.handle('lightshow-list', (event, paritionName) =>  {
    let ligthshowService = new LightshowService();
    return ligthshowService.getAllLigthshow(paritionName)
  })

  ipcMain.handle('lightshow-copy',  async (event, device, mountPoint, lightshowName) =>  {
    let copyManager = new CopyManagerService();
    await copyManager.copyFromDisk(device, mountPoint, lightshowName)
  })

  ipcMain.handle('lightshow-remove',  async (event, device, mountPoint, lightshowName) =>  {
    let copyManager = new CopyManagerService();
    await copyManager.removeFromDisk(device, mountPoint, lightshowName)
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
