const fs = require('fs')
const {dialog} = require("electron");
require('dotenv').config();


class LigthshowService{

  static usbLigthsow;


    //
    // createLigthshow(ligthshow) {
    //     prisma.Ligthshow.create({
    //         data: {
    //             ligthshow,
    //             content,
    //             published: false,
    //             author: { connect: { email: authorEmail } },
    //         },
    //     })
    // }

  constructor() {
    let envVarUsbLigthshow  = process.env.LIGHTSHOW_DIR
    if (!LigthshowService.usbLigthsow && envVarUsbLigthshow ){
      LigthshowService.usbLigthsow = envVarUsbLigthshow;
    } else if (!LigthshowService.usbLigthsow){
      LigthshowService.usbLigthsow = dialog.showOpenDialogSync({ properties: ['openDirectory'] })[0]
    }
  }

    isExistLightshowOnServer(ligthshowName){
        let audio = this.getAudioFileName(ligthshowName) !== null;
        let fseq = this.getFseqLigthshow(ligthshowName) !== null;
        return audio && fseq;
    }

    #getBaseFile(ligthshowName){
        return LigthshowService.usbLigthsow + '/' + ligthshowName
    }

    isExistLigthshowOnPath(path, lightshowName){
      return fs.existsSync(path + '/lightshow/' + lightshowName + '.fseq')
    }

    getAudioFileName(ligthshowName){
        let base = this.#getBaseFile(ligthshowName)
        let extensions = [ 'mp3', 'wav']
        let filename = null;
        extensions.forEach((ext) => {
            let tmpfileName = base + '.' + ext
            if (fs.existsSync(tmpfileName) && filename === null){
                filename = tmpfileName;
            }else if (fs.existsSync(tmpfileName) && filename !== null){
                throw new Error('Multiple audio file for the same Lightshow')
            }
        })
        return filename;

    }

    getFseqLigthshow(ligthshowName){
        let filename = null;
        let base2 = LigthshowService.usbLigthsow + '/' + ligthshowName
        let tmp = base2 + '.fseq'
        if (fs.existsSync(tmp)){
            filename = tmp;
        }
        return filename;
    }

  /**
   *
   * @param paritionName MountPath[]
   * @returns {*[]}
   */
    getAllLigthshow(paritionName) {
      let lightshows = [];
      let ligthshowNames = [];
      let files = fs.readdirSync(LigthshowService.usbLigthsow);
      files.forEach( (file) => {
        // Do whatever you want to do with the file
        let lightshowNameArray = file.split('.');
        let lightshowName = "";
        lightshowNameArray.forEach((element, index) => {
          if (index !== (lightshowNameArray.length - 1)){
            if (index !== 0){
              lightshowName += '.'
            }
            lightshowName += element;
          }
        })
        let lightshowObjet = {
          lightshowName : lightshowName,
          onDevice : this.isExistLigthshowOnPath(paritionName.path, lightshowName)
        };
        if (!ligthshowNames.includes(lightshowName) && lightshowName){
          lightshows.push(lightshowObjet)
          ligthshowNames.push(lightshowName)
        }
      });
      return lightshows;
    }
}


module.exports = LigthshowService
