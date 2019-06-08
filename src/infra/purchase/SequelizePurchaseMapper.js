const Purchase = require('src/domain/purchase/Purchase');
const ProductMapper = require('../product/SequelizeProductMapper');
const CustomerMapper = require('../customer/SequelizeCustomerMapper');
const ChallengeMapper = require('../challenge/SequelizeChallengeMapper');

const SequelizePurchaseMapper = {
  toEntity({ dataValues }) {
    const {
      id,
      customerId,
      product,
      createdAt
    } = dataValues;
    const purchaseProduct = product ? ProductMapper.toEntity(product) : undefined;
    return new Purchase({
      id,
      customerId,
      product: purchaseProduct,
      createdAt
    });
  },

  toDatabase(survivor) {
    const {
      customerId,
      product,
    } = survivor;

    return {
      customerId: customerId,
      product: product.id
    };
  },

  toChallengeCustomerEntity({ dataValues }) {
    const {
      id,
      customerId,
      challengeId,
      rewardId
    } = dataValues;

    return {
      id,
      customerId,
      challengeId,
      rewardId
    }
  },

  toChallengeCustomerDatabase(data) {
    const {
      id,
      customerId,
      challengeId,
      rewardId
    } = data;

    return {
      id,
      challengeId,
      customerId,
      rewardId
    }
  }
};

module.exports = SequelizePurchaseMapper;
