const Challenge = require('src/domain/challenge/Challenge');
const ProviderMapper = require('../provider/SequelizeProviderMapper');
const ProductMapper = require('../product/SequelizeProductMapper');

const SequelizeChallengeMapper = {
  toEntity({ dataValues }) {
    const {
      id,
      name,
      description,
      provider,
      steps
    } = dataValues;
    let products = [];

    if (steps) {
      products = steps.map(s => {
        const product = s.dataValues.product;
        if (product) {
          console.log(s.dataValues.purchaseSteps);
          product.dataValues.isReward = s.dataValues.isReward;
          product.dataValues.stepId = s.dataValues.id;
          product.dataValues.status =
            (s.dataValues.purchaseSteps && s.dataValues.purchaseSteps.length) ? 'done' : undefined;
          return ProductMapper.toEntity(product);
        }
      });
    }

    const challengeProvider = provider ? ProviderMapper.toEntity(provider) : undefined;
    return new Challenge({
      id,
      name,
      description,
      provider: challengeProvider,
      products
    });
  },

  toDatabase(entity) {
    const {
      name,
      description,
    } = entity;

    return {
      name,
      description,
      providerId: entity.provider.id
    };
  },

  toStepDatabase(challengeId, products) {
    const productsList = products.map(r => {
      return {
        productId: r.id,
        isReward: r.isReward,
        challengeId
      };
    });
    return productsList
  },
};

module.exports = SequelizeChallengeMapper;
