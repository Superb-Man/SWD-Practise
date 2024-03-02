const express = require('express');
const paymentController = require('../controllers/paymentController');
// const paymentSuccessTrain = require('../controllers/paymentSuccessTrain');
// const paymentSuccessAir = require('../controllers/paymentSuccessAir');
const bodyParser = require('body-parser').json();

const router = express.Router();

router.post('/init', bodyParser, paymentController.paymentInit);
router.post('/success/:tran_id', bodyParser, paymentController.paymentSuccessAir);
// router.post('/paymentSuccessTrain', bodyParser, paymentSuccessTrain.paymentSuccessTrain);
// router.post('/paymentSuccessAir', bodyParser, paymentSuccessAir.paymentSuccessAir);
router.post('/fail', bodyParser, paymentController.paymentFail);
// router.post('/paymentSuccessProfile', bodyParser, paymentController.paymentSuccessProfile);
// router.post('/paymentSuccessTrainProfile', bodyParser, paymentSuccessTrain.paymentSuccessTrainProfile);
// router.post('/paymentSuccessAirProfile', bodyParser, paymentSuccessAir.paymentSuccessAirProfile);
// router.post('/paymentInitProfile', bodyParser, paymentController.paymentInitProfile);

module.exports = router;