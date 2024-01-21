const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes/routes');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.port;

app.use(express.json());
app.use(cors());
app.use('/user', router);

app.get('/', (req, res) => {
    res.send('Account service is up and running');
});

app.listen(port, () => {
    console.log(`Account service listening on port ${port}`);
});