const Product = require('src/domain/product/Product');
const ProviderMapper = require('../provider/SequelizeProviderMapper');

const SequelizeProductMapper = {
  toEntity({ dataValues }) {
    const {
      id,
      name,
      image,
      description,
      provider,
      isReward,
      stepId
    } = dataValues;
    const porductPorvider = provider ? ProviderMapper.toEntity({dataValues: provider}) : undefined;
    return new Product({
      id,
      name,
      image,
      description,
      isReward,
      stepId,
      provider: porductPorvider
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
