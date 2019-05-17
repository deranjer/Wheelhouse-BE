const router = require('express').Router();
const getUser = require('../controllers/user_controllers/getUser');

router.get('/users/:userId', getUser);

module.exports = router;
