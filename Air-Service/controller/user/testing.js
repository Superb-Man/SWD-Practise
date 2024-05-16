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

const test = async (req, res) => {
    try {
        const obj = {"from":req.params.from};
        console.log(obj);

        const query1 = {
            text: 'SELECT * FROM "air_schedule_info" WHERE "from" = $1',
            values: [obj.from]
        }
        const results = await airPool.query('select * from air_schedule_info where from_port = $1', [obj.from]);
        console.log(results.rows);

        
        console.log(results.rows[0].cost_class);


        res.status(200).json(results.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}
module.exports = { test };