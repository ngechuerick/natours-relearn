const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = id =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  };

  if (process.env.NODE_ENV === 'production' && req.secure) {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'None';
  }

  /**Defining a cookie and sending it on the response object */
  res.cookie('jwt', token, cookieOptions);

  /**Remove the password from the output */
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  /**Check if email and password exits */
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  /**Check if user exists in DB and if password is correct */
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or password', 401));
  }

  /**IF everything is ok,send token to the client */
  createSendToken(user, 200, req, res);
});

/**Lets write a middleware function for logging out  a user */
exports.logout = catchAsync(async (req, res, next) => {
  /**Clear out the jwt cookie and which will automatically logout the user */
  res.clearCookie('jwt');

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  /**Getting the jsonwebtoken and if it exists */
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  /**Verification of the token(JWT)  */
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  /**Check if user still exists */
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exists', 401),
    );
  }

  /**Check if user changed password after the token(JWT) was issued */
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! ', 401));
  }

  /**Grant access to protected route! */
  /**Maniputaling the request object by adding the user!!! */
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

/**Only for rendered pages */
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      /**Token verificaition */
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      /**Check if user still exists */
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      /**Check if user changed password after the token(JWT) was issued */
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      /**THERE IS A LOGGED IN USER */

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    /**Roles is an array![] */
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403),
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  /**Get user based on POSTED  EMAIL */
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  /**Generate Random Token */
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  /**Send it back as an Email */
  const resetURL = `${req.protocol}://${req.get('host')}/passwordreset/${resetToken}`;

  const message = ` Forgot your password? Submit a PATCH request with your new password and passwordConfirm to :${resetURL}\n. <br> If you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail.sendRealEmail({
      email: user.email,
      subject: 'Your password reset token valid for (10min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending an email. Try again later', 500),
    );
  }
});

exports.verifyOtpCode = catchAsync(async (req, res, next) => {});

exports.resetPassword = catchAsync(async (req, res, next) => {
  /**Get user based on the token since we are sending */
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  /**IF token has not expired, and there is a user,set the new password */
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  /**Update changed passwordAt property for the user */

  /**Log the user in,send JWT */
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  /**Get user from the collection */
  const user = await User.findById(req.user.id).select('+password');

  /**Check if posted password is correct */
  if (!(await user.correctPassword(req.body.curPassword, user.password))) {
    return next(
      new AppError(
        'Wrong password.Please enter your correct current password!',
        401,
      ),
    );
  }

  /**If password is correct,update the password */
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  /**Log user in ,send JWT*/
  createSendToken(user, 200, req, res);
});
