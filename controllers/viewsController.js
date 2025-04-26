const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  /**Get tour from collection */
  const tours = await Tour.find();

  /**Building our template */
  /**Render that template using tour data from step 1 */
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  /**Get the data for the requested tour incluing the reviews and tour guides */
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  /**Render template using the data from step1 */
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login to your account',
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign up for an account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account.',
  });
};

exports.getResetPassword = (req, res) => {
  res.status(200).render('resetpassword', {
    title: 'Reset password if account exists',
  });
};

exports.getChangePassword = (req, res) => {
  res.status(200).render('updatepassword', {
    title: 'Reset password if account exists',
  });
};

exports.getSuccessPasswordReset = (req, res) => {
  res.status(200).render('success', {
    title: 'Reset password if account exists',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  /**Find bookings for the current user*/
  const bookings = await Booking.find({ user: req.user.id });

  /**Find tours with the returned IDS */
  const tourIds = bookings.map(el => el.tour);

  /**Select tours with the specified tourIds  TODO USING VIRTUAL POPULATE*/
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My booked tours',
    tours,
  });
});

/**Handling formData submission */
exports.updateUserdata = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true },
  );

  res.status(200).render('account', {
    title: 'Your account.',
    user: updatedUser,
  });
});
