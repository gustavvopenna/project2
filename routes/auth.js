const express = require('express');
const passport = require('passport');

const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res, next) => {
  res.render('auth/form', {
    title: 'Register',
    new: true,
    form: {
      title: 'Welcome',
      action: '/register',
      button: 'Create my account'
    }
  });
});
router.post('/register', (req, res, next) => {
  const { email, password } = req.body;

  const user = {
    email,
    role: 'admin'
  };

  // Registers the user
  User.register(user, password).then(user => {
    // Auth
    req.logIn(user, err => {
      if (err) return next(err);

      res.redirect('/dashboard');
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/form', {
    title: 'Login',
    form: {
      title: 'Welcome back',
      action: '/login',
      button: 'Login'
    }
  });
});
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res, next) => {
  req.app.locals.currentUser = req.user;

  res.redirect('/dashboard');
});

router.get('/logout', (req, res, next) => {
  req.app.locals.currentUser = null;
  req.logOut();

  res.redirect('/');
});

module.exports = router;
