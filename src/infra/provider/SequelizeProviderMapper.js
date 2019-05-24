const Provider = require('src/domain/user/Provider');

const SequelizeProviderMapper = {
  toEntity({ dataValues }) {
    const {
      id,
      name,
      logo,
      description,
      address,
      email,
      phone
    } = dataValues;

    return new Provider({
      id,
      name,
      logo,
      description,
      address,
      email,
      phone
    });
  },

  toDatabase(survivor) {
    const {
      name,
      logo,
      description,
      address,
      email,
      phone
    } = survivor;

    return {
      name,
      logo,
      description,
      address,
      email,
      phone
    };
  }
};

module.exports = SequelizeProviderMapper;
