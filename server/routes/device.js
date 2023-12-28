
var express = require('express');
const Deviceinformation = require('../service/deviceinformation');
const device = new  Deviceinformation();
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {


  let devices =await device.deviceList();
  res.json({
    'status' : 'ok',
    'device' : devices
  })
});
/* GET home page. */
router.post('/details', async function(req, res, next) {


  let devices =await device.deviceInformation(req.body.device);
  if (devices === null){
    res.status(404).json({});
  } else {
    res.json({
      'status' : 'ok',
      'device' : devices
    })
  }
});

module.exports = router;
