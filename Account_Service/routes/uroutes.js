const express = require('express');
const bodyParser = require('body-parser').json();
const userController = require('../controller/user');


const router = express.Router();

//test
// router.get('/getinfotest', bodyParser,userController.getInfo_test);
//it will be deleted later!

router.post('/signup', bodyParser,userController.userSignUp);
router.post('/login', bodyParser,userController.userLogin);
router.get('/passwordResetReq', bodyParser,userController.userPasswordResetReq);
router.get('/updatePassword', bodyParser,userController.userUpdatePassword);

module.exports = router;
