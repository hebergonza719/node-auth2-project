const router = require('express').Router();

// const checkRole = require('../auth/check-role-middleware');

const Users = require('./users-model.js');

const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch( err => res.send({ message: "you shall not pass!" }));
});

module.exports = router;