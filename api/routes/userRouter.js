const router = require('express').Router();
const getUser = require('../controllers/user_controllers/getUser');
const addUser = require('../controllers/user_controllers/addUser');

const addUserValidation = require('../validators/createUser');

const sanitizer = require('../sanitizer');

router.get('/users/:userId', getUser);
router.post('/users', sanitizer, addUserValidation, addUser);

module.exports = router;
