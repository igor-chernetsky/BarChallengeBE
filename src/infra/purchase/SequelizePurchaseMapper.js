const Purchase = require('src/domain/purchase/Purchase');
const ProductMapper = require('../product/SequelizeProductMapper');
const CustomerMapper = require('../customer/SequelizeCustomerMapper');
const ChallengeMapper = require('../challenge/SequelizeChallengeMapper');

const SequelizePurchaseMapper = {
  toEntity({ dataValues }) {
    const {
      id,
      customer,
      product,
      createdDate
    } = dataValues;
    const purchaseProduct = product ? ProductMapper.toEntity(product) : undefined;
    return new Purchase({
      id,
      customer,
      product: purchaseProduct,
      createdDate
    });
  },

  toDatabase(survivor) {
    const {
      customer,
      product,
    } = survivor;

    return {
      customerId: customer.id,
      product: product.id
    };
  },

  toChallengeCustomerEntity({ dataValues }) {
    const {
      id,
      customerId,
      challengeId,
      stepsLeft,
      rewardId
    } = dataValues;

    return {
      id,
      customerId,
      challengeId,
      stepsLeft,
      rewardId
    }
  },

  toChallengeCustomerDatabase(data) {
    const {
      id,
      customerId,
      challengeId,
      stepsLeft,
      rewardId
    } = data;

    return {
      id,
      challengeId,
      customerId,
      stepsLeft,
      rewardId
    }
  }
};

module.exports = SequelizePurchaseMapper;
