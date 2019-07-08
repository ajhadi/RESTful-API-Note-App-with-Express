const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const routes = require('./routes');
const dotenv = require('dotenv').config();
const cors = require('cors');

var whitelist = ['http://localhost','http://192.168.6.182', undefined];

var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
}

app.use(cors(corsOptions));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(bodyParser.json());


routes(app);

app.listen(port);
console.log('Server running!');