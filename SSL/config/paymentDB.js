const { Pool } = require('pg');
require('dotenv').config();

// console.log(process.env.uriPayment);
const paymentPool = new Pool({
    connectionString : process.env.uriPayment,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: {
        rejectUnauthorized: false,
    }
});

paymentPool.connect(err => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected to payment database');
    }
});

module.exports = paymentPool;