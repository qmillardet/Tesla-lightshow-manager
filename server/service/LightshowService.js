const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
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
}


module.exports = LigthshowService