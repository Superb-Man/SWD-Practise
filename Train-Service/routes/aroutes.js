const express = require('express');
const bodyParser = require('body-parser').json();
const scheduleController = require('../controller/admin/addschedule');
const routeController = require('../controller/admin/routes');
const trainController = require('../controller/admin/train');

const router = express.Router();


//admin
//POST+DELETE+PUT request
router.post('/addschedule', bodyParser,scheduleController.addschedule) ; //tested
router.post('/routes/update', bodyParser,routeController.updateRoutes) ; //tested
router.post('/routes/add', bodyParser,routeController.addRoutes) ;//tested
router.post('/routes/deleteRoutes', bodyParser,routeController.deleteRoutes) ; //tested
router.post('/train/addTrain', bodyParser,trainController.addTrain) ; //tested
router.post('/train/addTrainCompany', bodyParser,trainController.addTrainCompany) ; //tested
router.post('/train/addDetails', bodyParser,trainController.addDetails) ; //tested
router.post('/train/updateSchedule', bodyParser,scheduleController.updateSchedule) ; //tested
router.post('/train/getInfoBySchedule', bodyParser,scheduleController.getSeatInfoBySchedule) ; //tested
router.post('/train/updateBookingStatus', bodyParser,scheduleController.updateBookingStatus) ; //tested
//booking
//setBookingStatusByCoach




//GET request
//get most recent 10 schedules of train_company
// router.get('/train/getRecentSchedules/:train_company', bodyParser,scheduleController.getRecentSchedules) ; //Not-tested
router.get('/train/getRoutes/:train_uid', bodyParser,routeController.getRoutes) ; //tested
router.get('/train/getAllTrains/:company_name', bodyParser,trainController.getAllTrainsByCompanyName) ; //tested
router.get('/train/getAllCoaches/:train_uid', bodyParser,trainController.getAllCoachesDetails) ; //tested
router.get('/train/getCoachDetails/:train_uid/:coach_name', bodyParser,trainController.getCoachDetails) ; //tested
router.get('/train/getSeatAvailabe/:train_uid/:coach_name/:schedule_id', bodyParser,scheduleController.getSeatAvailableBySchedule) ;
router.get('/train/test', bodyParser,trainController.redirect) ; //tested
router.get('/train/getSchedule/:train_uid', bodyParser,scheduleController.getScheduleByUID) ; //-tested





module.exports = router;