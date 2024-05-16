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

//I have to start from here --- Kuljit
// router.get('/train/route_details',bodyParser,usearchController.getAllroutesDetailsByTrainUid) ;
router.post('/bus/:from/:to/:date/:category?', bodyParser,usearchController.getbusinfo) ;
router.post('/seat_details/:from/:to/:date/:category', bodyParser,usearchController.getSeatAvailableByspecificbus) ;


router.post('/bus/temp_booking/:from/:to/:date/:category', bodyParser,userBookingController.seatBooking) ;



module.exports = router;