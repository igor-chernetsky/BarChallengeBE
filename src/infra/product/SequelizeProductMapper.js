const Product = require('src/domain/product/Product');

const SequelizeProductMapper = {
  toEntity({ dataValues }) {
    const {
      id,
      name,
      image,
      description,
      provider
    } = dataValues;

    const productProvider = {
      id: provider.id,
      name: provider.name,
      description: provider.description,
      address: provider.address,
      logo: provider.logo,
      phone: provider.phone,
      email: provider.email
    };

    return new Product({
      id,
      name,
      image,
      description,
      provider: productProvider
    });
  },

  toDatabase(survivor) {
    const {
      name,
      image,
      description,
    } = survivor;

    return {
      name,
      image,
      description,
      providerId: survivor.provider.id
    };
  }
};

module.exports = SequelizeProductMapper;
