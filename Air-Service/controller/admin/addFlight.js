const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const airPool = require('../../config/airDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');

dotenv.config();
//token check hobe
const secret = process.env.secret;


const addFlight = async (req, res) => {
}