const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey ;

// console.log(process.env.uritrain);
const busPool = new Pool({
    connectionString : process.env.uriBus,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: {
        rejectUnauthorized: false,
    }
});


busPool.connect(err => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected to bus database');
    }
});

//const trainPool2 = createClient(supabaseUrl,supabaseKey);

module.exports = {
    busPool,
    //trainPool2
}