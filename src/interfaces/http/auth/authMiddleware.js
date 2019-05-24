let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
  const {auth} = req.container.cradle.config.web;

  if (req.method === 'POST' && req.body.password) {
    bcrypt.hash(req.body.password, auth.saltRounds).then(function(hash) {
      req.body.passwordHash = hash;
      checkToken(req, res, next, auth);
    });
  } else {
    checkToken(req, res, next, auth);
  }

}

function checkToken(req, res, next, auth) {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    const decoded = jwt.verify(token, auth.secret);
    if (decoded) {
      req.role = decoded.role;
      req.userId = decoded.id;
    }
    next();
  } else {
    next();
  }
}
