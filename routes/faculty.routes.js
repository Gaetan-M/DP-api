const express = require('express')
const router = express.Router();

const faculty = require('../controllers/faculty.controller');

router.use('/', faculty)


module.exports = router;