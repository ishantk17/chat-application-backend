const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      // User not found, create a new user
      user = new User({ email, password });
      await user.save();
      res.status(200).send('Welcome to the club!');
    } else {
      // User found, authorize the user
      user.comparePassword(password, (err, isMatch) => {
        if (isMatch && !err) {
          res.status(200).json(user);
        } else {
          res.status(401).json({ error: 'Incorrect email or password' });
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error please try again' });
  }
});

module.exports = router;


