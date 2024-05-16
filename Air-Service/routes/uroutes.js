const express = require('express');
const bodyParser = require('body-parser').json();
const testing = require('../controller/user/testing');
const usearchController = require('../controller/user/searching')
const userBookingController = require('../controller/user/booking');


const router = express.Router();

//test
// router.get('/getinfotest', bodyParser,userController.getInfo_test);
//it will be deleted later!
router.get('/test/:from', bodyParser,testing.test);
router.get('/air/from=:from', bodyParser,usearchController.getairinfoByfrom) ;
router.get('/air/to=:to', bodyParser,usearchController.getairinfoByto) ;
router.get('/air/flight_id=:flight_id', bodyParser,usearchController.getairinfoByFlightID) ;
router.get('/air/air_company=:air_company_name', bodyParser,usearchController.getairinfoByAirCompany) ;
router.get('/air/:from/:to/:date/person=:persons/:class?', bodyParser,usearchController.getairinfo) ;
router.get('/seat_details/:from/:to/:date/person=:persons/:class/:flight_id', bodyParser,usearchController.getSeatAvailableByspecificFlight) ;


router.post('/air/temp_booking/:from/:to/:date/person=:persons/:class/:flight_id', bodyParser,userBookingController.temporarySeatBooking) ;
router.post('/air/cancelBooking', bodyParser,userBookingController.cancelBooking) ;
router.post('/air/history', bodyParser,userBookingController.history) ;


module.exports = router;