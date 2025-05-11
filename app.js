const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const cron = require('node-cron');
const http = require('http');

const mongoSanitize = require('express-mongo-sanitize');

const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewsRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewsRouter = require('./routes/viewRoutes');
const bookingController = require('./controllers/bookingController');

const app = express();

app.enable('trust proxy', true);

/**The request object not to be in json format but as RAW format */
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);

/**FIXME A CRON JOB FOR KEEPING THE SERVER UP AND RUNNING */
cron.schedule('*/1 * * * *', () => {
  http
    .get('http://127.0.0.1:3000/api/v1/cronRoute', (req, res) => {
      console.log('up and running');
    })
    .on('error', () => {
      console.log('there was an error pinging');
    });
});

/**Serving the static files */
app.use(express.static(path.join(__dirname, 'public')));

/** Enable passing form data from client*/
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1)Global Middlewares
/**Third party midllewares */
/**Parses data from cookies */
app.use(cookieParser());

/**Implement cors */
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// app.options('*', cors());

/**Helmet configurations */
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: [
        "'self'",
        'https://api.mapbox.com/mapbox-gl-js/',
        'https://unpkg.com',
        'https://js.stripe.com/',
        "'unsafe-inline'",
        "'unsafe-eval'",
      ],
      workerSrc: ["'self'", 'blob:'], // For Mapbox Web Workers
      styleSrc: [
        "'self'",
        'https://api.mapbox.com/mapbox-gl-js/',
        'https://fonts.googleapis.com',
        "'unsafe-inline'",
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
        'https://api.mapbox.com/fonts/v1/mapbox/',
      ],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com'],
      connectSrc: [
        "'self'",
        'https://api.mapbox.com/v4/',
        'https://api.mapbox.com/raster/v1/',
        'https://js.stripe.com/basil/stripe.js',
        'https://js.stripe.com/',
        'https://api.stripe.com',
        'https://api.mapbox.com/rasterarrays/v1/',
        'https://api.mapbox.com/styles/v1/mapbox/',
        'https://api.mapbox.com/styles/v1/',
        'https://api.mapbox.com/fonts/v1/mapbox/',
        'https://api.mapbox.com/models/v1/mapbox/',
        'https://api.mapbox.com/map-sessions/v1',
        'https://events.mapbox.com/',
        'http://127.0.0.1:3000',
        'ws://localhost:1234/',
      ],
      frameSrc: [
        'https://js.stripe.com', // For Stripe Elements iframes
      ],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"],
      scriptSrcAttr: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
);

/**Displaying logs based on user's requests */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP please try again in an hour.',
});

/**Implementing rate limiter middleware on our API */
app.use('/api', limiter);

/**Passes incoming json payloads in the request body making the parsed data accesible through req.body */
app.use(
  express.json({
    limit: '10kb',
  }),
);

/**Data sanitization against NoSQL query injection */
app.use(mongoSanitize());

/**Data sanitization against XSS MORE IMPLEMENTATION SOON*/

/**HPP HTTP PARAMETER POLUTION PREVENTION */
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression());

//CUSTOM TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/**Mounting the routers */
app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/bookings', bookingRouter);

app.get('/api/v1/cronRoute', (req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

/**Handling all unhandled routes */
app.all('*', (req, res, next) => {
  // if (process.env.NODE_ENV === 'development') {
  //   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // }

  res.status(404).render('404', {
    title: 'Page not found',
    data: `Can't find resource ${req.originalUrl} on this server!`,
  });
});

/**GLOBAL ERROR HANDLING MIDDLEWARE */
app.use(globalErrorController);

module.exports = app;
``;
