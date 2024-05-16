const { Pool } = require('pg');
require('dotenv').config();

const accountPool = new Pool({
    connectionString : process.env.uriAccount,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: {
        rejectUnauthorized: false,
    }
});

accountPool.connect(err => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected to account database');
    }
});

module.exports = accountPool;