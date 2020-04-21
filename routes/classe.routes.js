const express = require('express')
const router = express.Router();

const classe = require('../controllers/classe.controller');
const modul = require('../controllers/module.controller');

router.use('/', classe)
router.use('/module', modul)


module.exports = router;