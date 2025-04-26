const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const duplicateVal = err.errorResponse.errmsg.match(
    /(["'])(?:(?=(\\?))\2.)*?\1/,
  )[0];

  const message = `Duplicate field value: ${duplicateVal}. Please use another value`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(val => val.message);

  const message = `Invalid input data:  ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (req, err, res) => {
  /**API */
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // console.log('ERROR 💣', err);
  /**RENDERED (CLIENT) */
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (req, err, res) => {
  // Operational Trusted error: Send message to the client
  /**API */
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming or other unknown errors: dont want to leak the contents to the client
    }
    /**Log error to the console */
    // console.log('ERROR 💣', err);

    /**Send generic message to the client */
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: 'Please try again later.',
    });
  }

  // RENDERED (CLIENT)
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
    // Programming or other unknown errors: dont want to leak the contents to the client
  }
  /**Log error to the console */
  // console.log('ERROR 💣', err);

  /**Send generic message to the client */
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(req, err, res);
  } else if (process.env.NODE_ENV === 'production') {
    /**Create a shallow copy of the error */
    let error = Object.assign(err, { ...err });

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(req, error, res);
  }
};
