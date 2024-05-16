const express = require('express');
const paymentControllerAir = require('../controllers/paymentControllerAir');

const paymentControllerTrain = require('../controllers/paymentControllerTrain');
const paymentControllerBus = require('../controllers/paymentControllerBus');
const bodyParser = require('body-parser').json();

const router = express.Router();

router.post('/initAir', bodyParser, paymentControllerAir.paymentInitAir);
router.post('/successAir', bodyParser, paymentControllerAir.paymentSuccessAir);
router.post('/failAir', bodyParser, paymentControllerAir.paymentFail);

router.post('/initTrain', bodyParser, paymentControllerTrain.paymentInitTrain);
router.post('/successTrain', bodyParser, paymentControllerTrain.paymentSuccessTrain);
router.post('/failTrain',bodyParser,paymentControllerTrain.paymentFail);

router.post('/initBus', bodyParser, paymentControllerBus.paymentInitBus);
router.post('/successBus', bodyParser, paymentControllerBus.paymentSuccessBus);
router.post('/failBus',bodyParser,paymentControllerBus.paymentFail);
// testing ticket
router.post('/ticket' , bodyParser , paymentControllerTrain.ticket )
// router.post('/paymentControllerProfile', bodyParser, paymentController.paymentControllerProfile);
// router.post('/paymentControllerTrainProfile', bodyParser, paymentControllerTrain.paymentControllerTrainProfile);
// router.post('/paymentControllerAirProfile', bodyParser, paymentControllerAir.paymentControllerAirProfile);
// router.post('/paymentInitProfile', bodyParser, paymentController.paymentInitProfile);

module.exports = router;