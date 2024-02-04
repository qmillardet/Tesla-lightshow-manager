const NotFoundDevice = require("./Exceptions/NotFoundDevice");

class Deviceinformation {


    async deviceList(){
        const drivelist = require('drivelist');

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
        const drivelist = require('drivelist');

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
}
module.exports = Deviceinformation
