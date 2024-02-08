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

app.use(express.json());
app.use(cors());
app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.get('/', (req, res) => {
    res.send('Air service is up and running');
});

app.listen(port, () => {
    console.log(`Air service listening on port ${port}`);
});