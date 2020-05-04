const express = require('express')
const router = express.Router();
const supportForum = require('../controllers/supportForum.controller');

router.get('/', supportForum.getAllSupport)
router.get('/:filename', supportForum.getOneSupport)
// router.post('/upload', supportForum.postSupport)
router.delete('/:_id', supportForum.deleteOneSupport)

module.exports = router;