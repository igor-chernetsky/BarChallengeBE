const Provider = require('src/domain/user/Provider');

const SequelizeProviderMapper = {
  toEntity({ dataValues }) {
    const {
      id,
      name,
      logo,
      description,
      lat,
      lng,
      city,
      address,
      email,
      status,
      phone,
      providerImages
    } = dataValues;

    let images = [];
    if (providerImages && providerImages.length) {
      images = providerImages.map(pi => pi.image);
    }

    return new Provider({
      id,
      name,
      logo,
      description,
      lat,
      lng,
      city,
      address,
      email,
      images,
      phone
    });
  },

  toDatabase(survivor) {
    const {
      name,
      logo,
      description,
      lat,
      lng,
      city,
      address,
      email,
      status,
      phone
    } = survivor;

    return {
      name,
      logo,
      description,
      lat,
      lng,
      city,
      address,
      email,
      status,
      phone
    };
  }
};

module.exports = SequelizeProviderMapper;
