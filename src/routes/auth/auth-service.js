const bcrypt = require('bcryptjs');
const config = require('../../config');
const jwt = require('jsonwebtoken');

const AuthService = {
  getUserWithUserName(db, username) {
    return db('user')
      .where({ username })
      .first();
  },
  getUser(db, username) {
    return db('user')
      .where({ username })
      .first();
  },

  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },

  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256'
    });
  },

  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256']
    });
  }

};


module.exports = AuthService;