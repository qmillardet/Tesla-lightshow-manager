const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()
const usbLightshow = process.env.LIGHTSHOW_DIR || '';
class LigthshowService{


    async getAllLigthshow() {
        const posts = await prisma.Lightshow.findMany({
        })

        return posts;
    }

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
}


module.exports = LigthshowService