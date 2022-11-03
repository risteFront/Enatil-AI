const compression =require('compression');
const cookieParser =require('cookie-parser');
const cors =require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoose = require('mongoose');
const morgan = require('morgan');
const emoji = require('node-emoji');
const responseTime =require('response-time');
const favicon =require('serve-favicon');
const indexRouter  =require('./routes/index.js');
const crawlerRouter  =require('./routes/crawler');

const app = express();

// secure the server by setting various HTTP headers
app.use(helmet());

// only parse JSON
app.use(express.json());

// only parse urlencoded bodies
app.use(express.urlencoded({ extended: false }));

// protect against HTTP parameter pollution attacks
app.use(hpp());

// gzip/deflate/br compression outgoing responses
app.use(compression());

// parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

// allow AJAX requests to skip the Same-origin policy and access resources from remote hosts
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));



app.use(favicon(__dirname + '/favicon.ico'));

// request logger | (dev) output are colored by response status
app.use(morgan('dev'));

// records the response time for HTTP requests
app.use(responseTime());

// limit repeated requests to endpoints such as password reset
app.use(
  new rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: 'Too many requests from this IP, please try again in 15 minutes'
  })
);

// loads environment variables from a config.env file into process.env
dotenv.config({ path: 'config.env' });

// prevent MongoDB operator injection by sanitizing user data.
app.use(mongoSanitize());

// mongodb connection
mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST_DOCKER}:${process.env.MONGO_PORT}/${process.env.DATABASE}`,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log(emoji.get('heavy_check_mark'), 'MongoDB connection success');
  });

// routes
app.use('/', indexRouter);
app.use('/crawler', crawlerRouter);

// setup ip address and port number
app.set('port', process.env.SERVER_PORT || 4000);
app.set('ipaddr', '0.0.0.0');

// start express server
app.listen(app.get('port'), app.get('ipaddr'), function () {
  console.log(emoji.get('heart'), 'The server is running @ ' + 'http://localhost/' + process.env.SERVER_PORT, emoji.get('heart'));
});
