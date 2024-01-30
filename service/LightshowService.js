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

    getAllLigthshow(ParitionName) {
      let lightshows = [];
      let files = fs.readdirSync(usbLightshow);
      files.forEach(function (file) {
        // Do whatever you want to do with the file
        let lightshowName = file.split('.')[0];
        if (!lightshows.includes(lightshowName) && lightshowName){
          lightshows.push(lightshowName)
        }
      });
      return lightshows;
    }
}


module.exports = LigthshowService
