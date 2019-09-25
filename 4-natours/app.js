const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); // everyone uses this
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// adds a bunch of methods
const app = express(); // doing this is standard

// 1) GLOBAL MIDDLEWARES ----------------------------

// Set Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // use for logging
}

// limit requests from same API
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
// use limiter on all routes starting with /api
app.use('/api', limiter);

// BODY PARSER, reading data from body into req.body
// use middleware (function that modifies incoming request data)
// data from body is added to request
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution, allow duplicate values for whitelist
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// serves a static file from the public folder
// and not from a route
app.use(express.static(`${__dirname}/public`));

// create our own middleware function
// we have access to the "next" function,
// using it here tells express this is middleware
// note that order matters, handling requests before
// this definition will end the response cycle
// app.use((req, res, next) => {
//   console.log('hello from middleware');
//   next(); // without this, cycle would get stuck
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES -------------------------------
// mount routers
app.use('/api/v1/tours', tourRouter); // specify route and router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// CATCH ALL ERRORS. Note that this is at the end of the file!
app.all('*', (req, res, next) => {
  // express assumes any arguments in next are an error
  // skips all other middleware and goes straight to error handler middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ERROR HANDLING MIDDLEWARE ------------------------------------------
app.use(globalErrorHandler);

module.exports = app; // export our app
