const express = require('express');
const bodyParser = require('body-parser').json();
const scheduleController = require('../controller/admin/addschedule');
const routeController = require('../controller/admin/routes');
const trainController = require('../controller/admin/train');

const router = express.Router();


//admin
router.get('/addschedule', bodyParser,scheduleController.addschedule) ;
router.get('/routes/update', bodyParser,routeController.updateRoutes) ;
router.get('/routes/add', bodyParser,routeController.addRoutes) ;
router.get('/deleteRoutes', bodyParser,routeController.deleteRoutes) ;
router.get('/train/addTrain', bodyParser,trainController.addTrain) ;
router.get('/train/addTrainCompany', bodyParser,trainController.addTrainCompany) ;
router.get('/train/addDetails', bodyParser,trainController.addDetails) ;


module.exports = router;