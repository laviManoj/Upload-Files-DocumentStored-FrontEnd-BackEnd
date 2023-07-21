const express = require('express'); //import express

const router  = express.Router(); 

const Controller = require('../controllers/fileController'); 

 router.post('/upload-file', Controller.uploadFiles)

module.exports = router;