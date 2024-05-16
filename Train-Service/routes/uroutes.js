const express = require('express');
const bodyParser = require('body-parser').json();
const testing = require('../controller/user/testing');
const usearchController = require('../controller/user/searching')
const userBookingController = require('../controller/user/booking');


const router = express.Router();

//test
// router.get('/getinfotest', bodyParser,userController.getInfo_test);
//it will be deleted later!
// router.get('/test/:from', bodyParser,testing.test);
// router.get('/train/from=:from', bodyParser,usearchController.gettraininfoByfrom) ;
// router.get('/train/to=:to', bodyParser,usearchController.gettraininfoByto) ;
// router.get('/train/flight_id:flight_id', bodyParser,usearchController.gettraininfoByFlightID) ;
// router.get('/train/train_company=:train_company_name', bodyParser,usearchController.gettraininfoBytrainCompany) ;
router.post('/train/route_details',bodyParser,usearchController.getAllroutesDetailsByTrainUid) ;
router.get('/train/:from/:to/:date/person=:persons/:coach?', bodyParser,usearchController.gettraininfo) ;
router.get('/seat_details/:from/:to/:date/person=:persons/:coach/:train_uid', bodyParser,usearchController.getSeatAvailableByspecifictrain) ;


router.post('/train/temp_booking/:from/:to/:date/person=:persons/:coach/:train_uid', bodyParser,userBookingController.temporarySeatBooking) ;
router.post('/train/cancelBooking', bodyParser,userBookingController.cancelBooking) ;
router.post('/train/history', bodyParser,userBookingController.history) ;



module.exports = router;