const { Pool } = require('pg');
require('dotenv').config();

// console.log(process.env.uriAir);
const airPool = new Pool({
    connectionString : process.env.uriAir,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: {
        rejectUnauthorized: false,
    }
});

airPool.connect(err => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected to air database');
    }
});

module.exports = airPool;