const express = require('express');
const bodyParser = require('body-parser').json();
const adminController = require('../controller/admin');

const router = express.Router();


//admin
router.get('/signup', bodyParser,adminController.adminSignup);
router.get('/login', bodyParser,adminController.adminLogin);

module.exports = router;