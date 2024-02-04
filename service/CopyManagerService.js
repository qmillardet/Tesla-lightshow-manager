const fs = require('fs');

const LigthshowManager = require('./LightshowService')
const DeviceManager = require('./deviceinformation');
const { join } = require('node:path');
const AlreadyExistLightshowError = require("./Exceptions/AlreadyExistLightshowError");


class CopyManagerService{
    async copyFromDisk(device, mountPointLabel, lightshowName ){
        let lightshowManagerService = new LigthshowManager();

        if (!lightshowManagerService.isExistLightshowOnServer(lightshowName)){
            throw new Error('Ce lightshow n\'existe pas : ' + lightshowName)
        }
        let ligthsowAudioFile = lightshowManagerService.getAudioFileName(lightshowName);
        let ligthsowFseqFile = lightshowManagerService.getFseqLigthshow(lightshowName);

        let baseDevice = await this.#getDeviceBaseWithLigthShow(device, mountPointLabel);

        await this.#moveTeslaCamDir(device, mountPointLabel)

        if (this.#isAlreadyExistLightshow(baseDevice, lightshowName)){
            throw new AlreadyExistLightshowError('Already exist Lightshow on device, please check file : ' + baseDevice + ' # ' + lightshowName)
        }
        fs.mkdirSync(baseDevice, { recursive: true })
        fs.copyFileSync(ligthsowAudioFile,  baseDevice+lightshowName + '.mp3' )
        fs.copyFileSync(ligthsowFseqFile, baseDevice + lightshowName + '.fseq'  )

    }

    #isAlreadyExistLightshow(deviceMountPouint, lightshowName){
        let ligthshowBase = deviceMountPouint + lightshowName;
        let fseq = fs.existsSync( ligthshowBase+ '.fseq')
        let wav = fs.existsSync(ligthshowBase + '.wav')
        let mp3 = fs.existsSync(ligthshowBase + '.mp3')
        return mp3 || wav || fseq;
    }

    async #moveTeslaCamDir(device, mountPointLabel){
        let deviceManager = new DeviceManager();
        let deviceMountPoint = await deviceManager.getMountPoint(device, mountPointLabel);
        let teslacamDir = deviceMountPoint + '/TeslaCam/'
        if(fs.existsSync(teslacamDir)){
            let date = new Date();
            fs.renameSync(teslacamDir, deviceMountPoint + '/TeslaCam-old/' )
        }
        return true;

    }

    async #getDeviceBaseWithLigthShow(device, mountPointLabel){
        let deviceManager = new DeviceManager();
        let deviceMountPoint = await deviceManager.getMountPoint(device, mountPointLabel);
        return deviceMountPoint + '/Lightshow/'
    }

  async removeFromDisk(device, mountPointLabel, lightshowName ){
    let lightshowManagerService = new LigthshowManager();

    if (!lightshowManagerService.isExistLightshowOnServer(lightshowName)){
      throw new Error('Ce lightshow n\'existe pas : ' + lightshowName)
    }

    let baseDevice = await this.#getDeviceBaseWithLigthShow(device, mountPointLabel);

    await this.#moveTeslaCamDir(device, mountPointLabel)

    if (this.#isAlreadyExistLightshow(baseDevice, lightshowName)){
      if (fs.existsSync(baseDevice+lightshowName + '.mp3' )){
        fs.rmSync(  baseDevice+lightshowName + '.mp3' )
      } else {
        fs.rmSync(  baseDevice+lightshowName + '.wav' )
      }
      fs.rmSync( baseDevice + lightshowName + '.fseq'  )
      let res = fs.readdirSync(baseDevice)
      if (!res.length){
        fs.rmdirSync( baseDevice)
      }
    }

  }
}

module.exports = CopyManagerService
