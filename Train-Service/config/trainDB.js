const { Pool } = require('pg');
require('dotenv').config();

// console.log(process.env.uritrain);
const trainPool = new Pool({
    connectionString : process.env.uriTrain,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: {
        rejectUnauthorized: false,
    }
});

trainPool.connect(err => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected to train database');
    }
});

module.exports = trainPool;