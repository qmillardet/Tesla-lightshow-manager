var express = require('express');
var router = express.Router();

const CopyManagerService = require('../service/CopyManagerService')

/* GET users listing. */
router.post('/server', async function(req, res, next) {
    //console.log(req.body.hasOwnProperty('device'))
    let device = req.body.device;
    let mountpoint = req.body.mountpoint.replace(/\\/g, '');
    let lightshowName = req.body.lightshowName.replace(/\\/g, '');
    try {

        let copyManagerService = new CopyManagerService();
        await copyManagerService.copyFromDisk(
            device,
            mountpoint,
            lightshowName
        )
        res.status(200).json({})
    } catch (e){
        res.status(500).json({'message' : e.stack})
    }

});

module.exports = router;
