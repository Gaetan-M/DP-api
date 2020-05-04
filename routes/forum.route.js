const express = require('express')
const router = express.Router();

const Forum= require('../controllers/forum.controller.js');

router.get('/', Forum.getData)

module.exports = router;