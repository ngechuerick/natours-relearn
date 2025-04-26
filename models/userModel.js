const crypto = require('crypto');
const moongose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new moongose.Schema({
  name: {
    type: String,
    required: [true, 'A user must contain a user name!'],
  },
  email: {
    type: String,
    // validate: {
    //   validator: function (value) {
    //     return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    //   },
    //   message: `{{value}} is not a valid email!`,
    // },
    required: [true, 'Please provide a valid email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    select: false, //Does not show up on response object
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password here!'],
    validate: {
      // This only works on CREATE AND SAVE!!!  NOT ON UPDATE
      validator: function (val) {
        return this.password === val;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/**Document  middleware */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

/**Query middleware */
userSchema.pre(/^find/, function (next) {
  // This points to the current query
  this.find({ active: { $ne: false } });
  next();
});

/**Instance methods which will be available on all object instances */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  /**Here we have used a random 6 digits */
  const randomToken = crypto.randomBytes(32).toString('hex');

  /**THIS IS IF WE WANT TO GENERATE 6 CODE OTP */
  // const resetToken = crypto.randomInt(100000, 999999).toString();

  const hashedToken = crypto
    .createHash('sha256')
    .update(randomToken)
    .digest('hex');

  this.passwordResetToken = hashedToken;

  this.passwordResetExpires = Date.now() + 6 * 60 * 1000;

  return randomToken;
};

const User = moongose.model('User', userSchema);

module.exports = User;
