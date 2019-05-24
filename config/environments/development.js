const path = require('path');
const logPath = path.join(__dirname, '../../logs/development.log');

module.exports = {
  web: {
    port: 3001,
    auth: {
      secret: 'devsecret',
      saltRounds: 10,
      passSalt: 'devsalt'
    }
  },
  logging: {
    appenders: [
      { type: 'console' },
      { type: 'file', filename: logPath }
    ]
  }
};
