module.exports = {
  web: {
    port: process.env.PORT || 3000,
    auth: {
      secret: 'hellodarknesmyoldfrienD',
      saltRounds: 15,
      passSalt: 'wordsFromSomeSongh3re',
      publicToken: 'bcPblPrdScrtTokenTkn'
    }
  },
  logging: {
    appenders: [
      { type: 'console', layout: { type: 'basic' } }
    ]
  },
  "AWS_KEYS": {
    "id": "AKIAJ5NVYP24OIXO5O5Q",
    "secret": "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"
  }
};
