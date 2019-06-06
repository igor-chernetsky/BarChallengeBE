module.exports = {
  web: {
    port: process.env.PORT,
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
  }
};
