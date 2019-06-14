module.exports = {
  development: {
    username: 'admin',
    password: 'Ser3nity',
    database: 'challengeDev',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: 'admin',
    password: 'Ser3nity',
    database: 'challengeTest',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: null
  },
  production: {
    username: 'dcadmin',
    password: 'Ser3nity',
    database: 'DrinkChallengeTest',
    host: 'drinkchallengetest.c1kolgkgncfn.eu-central-1.rds.amazonaws.com',
    dialect: 'postgres',
    logging: null,
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000
    }
  }
};
