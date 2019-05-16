const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to Wheelhouse!' });
});

module.exports = router;
