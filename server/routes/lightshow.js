var express = require('express');
var router = express.Router();


const LightshowService = require('../service/LightshowService');
const LigthShow = require('../model/Ligthshow')
/* GET users listing. */
router.get('/', async function(req, res, next) {
  let lightshowService = new LightshowService();
  let ligthshows = await lightshowService.getAllLigthshow()
  res.json(ligthshows)
});

router.post('/new', async function(req, res, next) {
  let lightshowService = new LightshowService();
  let ligthshow = new LigthShow();

  ligthshow.name = req.body.name;
  ligthshow.audioFile = req.body.name;

  lightshowService.createLigthshow(ligthshow);

  let ligthshows = await lightshowService.getAllLigthshow()
  res.json(ligthshows)
});

module.exports = router;
