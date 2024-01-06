class Deviceinformation {


    async deviceList(){
        const drivelist = require('drivelist');

        const drives =await  drivelist.list()
        let element = [];
        drives.forEach((drive) => {
            element.push({
                mountpoint : drive.mountpoints,
                device : drive.device
            })
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
            if (drive.device === deviceName ){
                drive.mountpoints.forEach((mountPoint) => {
                    if (mountPoint.label === pointName){
                        element = mountPoint.path
                    }
                })
            }
        })
        return element;
    }
}
module.exports = Deviceinformation