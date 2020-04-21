const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Coordonnateur = require('../models/coordonnateur.model');


router.get('/', auth, function (req, res) {

})

module.exports = router;