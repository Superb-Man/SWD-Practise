const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./routes/routes');
const bodyParser = require('body-parser');


dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/payment', router);

app.get('/', (req, res) => {

  /** 
  * Root url response 
  */
  res.send('Payment service is up and running');

  // return res.status(200).json({
  //   message: "Welcome to sslcommerz app",
  //   url: `${process.env.ROOT}/ssl-request`
  // })
});

// const corsOptions = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// app.use(cors(corsOptions));


app.listen(port, () => {
  console.log(`ssl app listening on port ${port}!`);
  console.log(`http://localhost:${port}`)
});
