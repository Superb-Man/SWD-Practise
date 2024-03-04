const { Pool } = require('pg');
 const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey ;

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

const trainPool2 = createClient(supabaseUrl,supabaseKey); 

module.exports = {
    trainPool,
    trainPool2
}