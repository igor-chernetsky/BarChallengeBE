const Customer = require('src/domain/user/Customer');

const SequelizeCusomerMapper = {
  toEntity({ dataValues }) {
    const {
      id,
      name,
      email,
      phone
    } = dataValues;

    return new Customer({
      id,
      name,
      email,
      phone
    });
  },

  toDatabase(survivor) {
    const result = {
      name: survivor.name,
      email: survivor.email,
      phone: survivor.phone
    };
    return result;
  }
};

module.exports = SequelizeCusomerMapper;
