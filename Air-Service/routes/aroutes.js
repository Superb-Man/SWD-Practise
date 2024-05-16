const express = require('express');
const bodyParser = require('body-parser').json();
const scheduleController = require('../controller/admin/addschedule');

const router = express.Router();


//admin
router.get('/addschedule', bodyParser,scheduleController.addschedule) ;

module.exports = router;