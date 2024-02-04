const fs = require('fs')
require('dotenv').config();

const usbLightshow = process.env.LIGHTSHOW_DIR || '';
class LigthshowService{




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

    isExistLightshowOnServer(ligthshowName){
        let audio = this.getAudioFileName(ligthshowName) !== null;
        let fseq = this.getFseqLigthshow(ligthshowName) !== null;
        return audio && fseq;
    }

    #getBaseFile(ligthshowName){
        return usbLightshow + '/' + ligthshowName
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
        let base2 = usbLightshow + '/' + ligthshowName
        let tmp = base2 + '.fseq'
        if (fs.existsSync(tmp)){
            filename = tmp;
        }
        return filename;
    }

    getAllLigthshow(paritionName) {
      let lightshows = [];
      let ligthshowNames = [];
      let files = fs.readdirSync(usbLightshow);
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
