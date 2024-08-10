const router = require('express').Router()
const mediaController = require('../controllers/mediaController')

router.post('/upload', mediaController.uploadFiles)
router.post('/loadAll', mediaController.getFiles)

module.exports = router