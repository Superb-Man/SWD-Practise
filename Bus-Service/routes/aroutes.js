const express = require('express');
const bodyParser = require('body-parser').json();
const scheduleController = require('../controller/admin/addschedule');
// const routeController = require('../controller/admin/routes');
// const trainController = require('../controller/admin/train');

const router = express.Router();


//admin
//POST+DELETE+PUT request
router.get('/addschedule', bodyParser,scheduleController.addschedule) ; //tested
// router.get('/routes/update', bodyParser,routeController.updateRoutes) ; //tested
// router.get('/routes/add', bodyParser,routeController.addRoutes) ;//tested
// router.get('/deleteRoutes', bodyParser,routeController.deleteRoutes) ; //tested
// router.get('/train/addTrain', bodyParser,trainController.addTrain) ; //tested
// router.get('/train/addTrainCompany', bodyParser,trainController.addTrainCompany) ; //tested
// router.get('/train/addDetails', bodyParser,trainController.addDetails) ; //tested


// //GET request
// router.get('/train/getRoutes/:train_uid', bodyParser,routeController.getRoutes) ; //tested
// router.get('/train/getAllTrainsByCompanyName/:company_name', bodyParser,trainController.getAllTrainsByCompanyName) ; //tested
// router.get('/train/getAllCoachesDetails/:train_uid', bodyParser,trainController.getAllCoachesDetails) ; //tested
// router.get('/train/getSeatAvailabe/:train_uid/:coach_name/:schedule_id', bodyParser,scheduleController.getSeatAvailableBySchedule) ;




module.exports = router;