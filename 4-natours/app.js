const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// adds a bunch of methods
const app = express(); // doing this is standard

// 1) MIDDLEWARES ----------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // use for logging
}

// use middleware (function that modifies incoming request data)
// data from body is added to request
app.use(express.json());

// serves a static file from the public folder
// and not from a route
app.use(express.static(`${__dirname}/public`));

// create our own middleware function
// we have access to the "next" function,
// using it here tells express this is middleware
// note that order matters, handling requests before
// this definition will end the response cycle
app.use((req, res, next) => {
  console.log('hello from middleware');
  next(); // without this, cycle would get stuck
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES -------------------------------
// mount routers
app.use('/api/v1/tours', tourRouter); // specify route and router
app.use('/api/v1/users', userRouter);

module.exports = app; // export our app
