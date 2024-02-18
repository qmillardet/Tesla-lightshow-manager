const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const url = require("url");
const path = require("path");
const DeviceService = require('./service/DeviceService')
const LightshowService = require('./service/LightshowService')
const CopyManagerService = require("./service/CopyManagerService");
const AlreadyExistLightshowError = require("./service/Exceptions/AlreadyExistLightshowError");
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

  let grantedDeviceThroughPermHandler

  mainWindow.webContents.session.on('select-usb-device', (event, details, callback) => {
    // Add events to handle devices being added or removed before the callback on
    // `select-usb-device` is called.
    mainWindow.webContents.session.on('usb-device-added', (event, device) => {
      console.log('usb-device-added FIRED WITH', device)
      // Optionally update details.deviceList
    })

    mainWindow.webContents.session.on('usb-device-removed', (event, device) => {
      console.log('usb-device-removed FIRED WITH', device)
      // Optionally update details.deviceList
    })

    event.preventDefault()
    if (details.deviceList && details.deviceList.length > 0) {
      const deviceToReturn = details.deviceList.find((device) => {
        return !grantedDeviceThroughPermHandler || (device.deviceId !== grantedDeviceThroughPermHandler.deviceId)
      })
      console.log(deviceToReturn)
      if (deviceToReturn) {
        callback(deviceToReturn.deviceId)
      } else {
        callback()
      }
    }
  })

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'usb' && details.securityOrigin === 'file:///') {
      return true
    }
  })

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'usb' && details.origin === 'file://') {
      if (!grantedDeviceThroughPermHandler) {
        grantedDeviceThroughPermHandler = details.device
        return true
      } else {
        return false
      }
    }
  })

  mainWindow.webContents.session.setUSBProtectedClassesHandler((details) => {
    return details.protectedClasses.filter((usbClass) => {
      // Exclude classes except for audio classes
      return usbClass.indexOf('audio') === -1
    })
  })



  mainWindow.on('closed', function () {
    mainWindow = null
  })

  ipcMain.handle('device-info', () =>  {
    let test = new DeviceService();
    return test.deviceList()
  })

  ipcMain.handle('lightshow-list', (event, paritionName) =>  {
    let ligthshowService = new LightshowService();
    return ligthshowService.getAllLigthshow(paritionName)
  })

  ipcMain.handle('lightshow-copy',  async (event, device, mountPoint, lightshowName) =>  {
    try{
      let copyManager = new CopyManagerService();
      await copyManager.copyFromDisk(device, mountPoint, lightshowName)
    } catch (e){
      if (e instanceof AlreadyExistLightshowError){
        console.info(e.message)
      } else {
        throw e
      }
    }
  })

  ipcMain.handle('lightshow-remove',  async (event, device, mountPoint, lightshowName) =>  {
    let copyManager = new CopyManagerService();
    await copyManager.removeFromDisk(device, mountPoint, lightshowName)
  })

  ipcMain.handle('device-eject',  async (event, mountPoint) =>  {
    let deviceService = new DeviceService();
    let device = await deviceService.getDeviceFromMountPoint(mountPoint)
    await deviceService.ejectMountPoint(device)
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
