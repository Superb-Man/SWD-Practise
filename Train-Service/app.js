const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/uroutes');
const adminRouter = require('./routes/aroutes');
// console.log(adminRouter);
// console.log(userRouter);
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.port;
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); // Allows requests from any origin
//     // res.header('Access-Control-Allow-Origin', 'http://yourdomain.com'); // Allow requests from specific origin
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
app.use(express.json());
app.use(cors());
app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.get('/', (req, res) => {
    res.send('Train service is up and running');
});

app.listen(port, () => {
    console.log(`Train service listening on port ${port}`);
});