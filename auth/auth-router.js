const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secrets = require('../config/secrets.js');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  Users.add(user)
    .then(saved => {
      const token = generateToken(user);
      res.status(201).json({ created_user: saved, token: token });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  // Users.findBy(username)
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `Welcome ${user.username}!`, jwt_token: token });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// router.delete('/logout', (req, res) => {
//   if (req.session) {
//     req.session.destroy((err) => {
//       if (err) {
//         res.status(400).json({ message: 'error logging out: ', error: err})
//       } else {
//         res.json({ message: "logged out" });
//       }
//     });
//   } else {
//     res.end();
//   }
// });


function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    // roles: ['ADMIN']
  };

  const secret = secrets.jwt_secret;

  const options = {
    expiresIn: '30 min'
  };

  return jwt.sign(payload, secret, options);
}


module.exports = router;