const NotFoundDevice = require("./Exceptions/NotFoundDevice");
const drivelist = require('drivelist');
const {exec} = require('child_process');
const NotYetImplementedError = require("./Exceptions/NotYetImplementedError");

class DeviceService {


    async deviceList(){


        const drives =await  drivelist.list()
        let element = [];
        drives.forEach((drive) => {
          let mountPoints   = drive.mountpoints;
          mountPoints.forEach((mountPoint ) =>{
            if (!element.includes(mountPoint)){
              element.push(mountPoint)
            }
          } )

        })
        return element;
    }


    async deviceInformation( deviceName){

        const drives =await  drivelist.list()
        let element = null;
        drives.forEach((drive) => {
            if (drive.device === deviceName ){
                element = drive;
            }
        })
        return element;
    }


    async getMountPoint( deviceName, pointName){
        const drivelist = require('drivelist');

        const drives =await  drivelist.list()
        let element = null;
        drives.forEach((drive) => {
          drive.mountpoints.forEach((mountPoint) => {
              if (mountPoint.label === pointName){
                  element = mountPoint.path
              }
          })
        })
      if (element === null){
        throw new NotFoundDevice('Device "' + deviceName + '" not found');
      }
        return element;
    }

    async ejectMountPoint( device){
      let  os = process.platform;
      console.log(device)
      switch (os){
        case 'darwin':
          this.ejectMacOS(device);
          break;
        case "win32":
          this.ejectWindows(device);
          break
        default:
          this.ejectLinux(device)
          break;

      }

    }

    ejectMacOS(device){
      let re = /[a-zA-Z0-9/]+/g;
      device.match(re)
      exec('diskutil unmountDisk force ' + device)
    }

  ejectWindows(device) {
      throw new NotYetImplementedError()
  }

  ejectLinux(device) {
    throw new NotYetImplementedError()
  }

  async getDeviceFromMountPoint(mountPointPath) {
    const drivelist = require('drivelist');

    const drives =await  drivelist.list()
    let element = null;
    drives.forEach((drive) => {
      drive.mountpoints.forEach((mountPoint) => {
        if (mountPoint.path === mountPointPath){
          element = drive.device;
        }
      })
    })
    if (element === null){
      throw new NotFoundDevice('Device of mountpoint  "' + mountPointPath + '" not found');
    }
    return element;
  }
}
module.exports = DeviceService
