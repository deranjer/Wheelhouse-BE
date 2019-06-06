/* eslint-disable no-trailing-spaces,guard-for-in,no-restricted-syntax */
function sanitizer(req, res, next) {
  for (const prop in req.body) {
    req.body[prop] = req.body[prop].trim();
  }

  next();
}

module.exports = sanitizer;
