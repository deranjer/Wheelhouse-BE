const User = require('../../../models/User');

async function getUser(req, res) {
  const { userId } = req.params;

  const user = await User.query().findById(userId);

  return res.status(200).json(user);
}

module.exports = getUser;
