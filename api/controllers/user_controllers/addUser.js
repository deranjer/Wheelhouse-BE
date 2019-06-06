/* eslint-disable camelcase,no-trailing-spaces */
const bcrypt = require('bcryptjs');
const User = require('../../../models/User');

async function addUser(req, res) {
  const {
    full_name,
    username,
    email,
    password,
    profile_photo_url,
    header_photo_url,
    work_status,
    bio,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.query()
    .insertGraph({
      full_name,
      username,
      email,
      password: hashedPassword,
      profile_photo_url: profile_photo_url || null,
      header_photo_url: header_photo_url || null,
      work_status,
      bio: bio || null,
    });

  if (user) {
    return res.status(200).json({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
    });
  }

  return res.status(500).json({ error: 'There was an error adding user to database. Please try again.' });
}

module.exports = addUser;
