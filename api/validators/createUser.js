/* eslint-disable no-trailing-spaces,camelcase */
const User = require('../../models/User');

async function createUserValidation(req, res, next) {
  const {
    full_name,
    username,
    email,
    password,
    confirm_password,
  } = req.body;

  const errors = {
    full_name: [],
    username: [],
    email: [],
    password: [],
    confirm_password: [],
  };

  // full_name validation
  if (!full_name) {
    errors.full_name.push('Full Name field is required.');
  }

  if (full_name && (full_name.length < 1 || full_name.length > 40)) {
    errors.full_name.push('Full Name must be between 1 and 40 characters long.');
  }

  if (full_name && !(/^[\w\-\s]+$/.test(full_name))) {
    errors.full_name.push('Full Name may only contain alphanumeric characters.');
  }

  // username validation
  if (!username) {
    errors.username.push('Username field is required.');
  }

  if (username && (username.length < 1 || username.length > 40)) {
    errors.username.push('Username must be between 1 and 40 characters long.');
  }

  if (username && !(/^[\w\-\s]+$/.test(username))) {
    errors.username.push('Username may only contain alphanumeric characters.');
  }

  const existingUsername = await User.query()
    .where('username', username);

  if (existingUsername.length > 0) {
    errors.username.push('Username already exists.');
  }

  // email validation
  if (!email) {
    errors.email.push('Email field is required.');
  }

  if (email && (email.length < 1 || email.length > 254)) {
    errors.email.push('Emails must be between 1 and 254 characters');
  }

  if (email && !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))) {
    errors.email.push('Please enter a valid email address.');
  }

  const existingUser = await User.query()
    .where('email', email);

  if (existingUser.length > 0) {
    errors.email.push('User already exists with that email address.');
  }

  // password verification
  if (!password) {
    errors.password.push('Password field is required.');
  }

  if (!confirm_password) {
    errors.confirm_password.push('Confirm Password field is required.');
  }

  if (password && (password.length < 8 || password.length > 255)) {
    errors.password.push('Password must be between 8 and 255 characters.');
  }

  if (password && confirm_password && password !== confirm_password) {
    errors.password.push('Password and Confirm Password fields must match.');
    errors.confirm_password.push('Password and Confirm Password fields must match.');
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const prop in errors) {
    if (errors[prop].length > 0) {
      return res.status(400)
        .json({ errors });
    }
  }

  return next();
}
module.exports = createUserValidation;
