const path = require('path');
const logPath = path.join(__dirname, '../../logs/development.log');

module.exports = {
  web: {
    port: 3001,
    auth: {
      secret: 'devsecret',
      saltRounds: 10,
      passSalt: 'devsalt',
      publicToken: 'bcPblTstTkn'
    }
  },
  logging: {
    appenders: [
      { type: 'console' },
      { type: 'file', filename: logPath }
    ]
  },
  awsKeys: {
    id: "AKIAJ5NVYP24OIXO5O5Q",
    secret: "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"
  }
};
