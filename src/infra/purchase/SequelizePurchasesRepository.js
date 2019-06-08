const ChallengeMapper = require('../challenge/SequelizeChallengeMapper');
const PurchaseMapper = require('./SequelizePurchaseMapper');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class SequelizePurchasesRepository {
  constructor({ ChallengeModel, StepModel, ProductModel, CustomerModel,
    ProviderModel, ChallengeCustomerModel, PurchaseModel, PurchaseStepModel }) {
    this.ChallengeModel = ChallengeModel;
    this.ProviderModel = ProviderModel;
    this.ProductModel = ProductModel;
    this.CustomerModel = CustomerModel;
    this.StepModel = StepModel;
    this.ChallengeCustomerModel = ChallengeCustomerModel;
    this.PurchaseModel = PurchaseModel;
    this.PurchaseStepModel = PurchaseStepModel;
  }

  async create(customerId, productId, providerId) {
    if(!this._isProductValid(productId, providerId)) {
      const forbiddenError = new Error('Forbidden');
      forbiddenError.details = `You don't have access to purchase this product.`;
      throw forbiddenError;
    }

    const params = {include: [
      {model: this.StepModel, where: {isReward: false}, include: {
        model: this.ProductModel,
        where: {id: productId}
      }}
    ]};
    const providerChallenges = await this.ChallengeModel.findAll(params).map(ChallengeMapper.toEntity);
    const createResult = await this.PurchaseModel.create({customerId, productId});
    const purchase = PurchaseMapper.toEntity(createResult);
    await Promise.all(providerChallenges.map(ch => {
      const stepIds = ch.products.filter(p => p.id === productId).map(p => p.stepId);
      this.StepModel.findAll({
        include: {
          model: this.ChallengeModel, include: {
            required: false,
            model: this.ChallengeCustomerModel,
            where: {customerId, rewardId: null},
            include: {
              model: this.PurchaseStepModel,
              required: false,
              where: Sequelize.where(
                Sequelize.col('stepId'),
                Sequelize.col('step.id')
              )
            }
          }
        },
        where: {
          challengeId: ch.id,
          productId,
          isReward: false,
          '$challenge->challengeCustomers.id$': {[Op.ne]: null},
          '$challenge->challengeCustomers->purchaseSteps.id$': null
        }
      })
      .then(async st => {
        if (st && st.length) {
          const firstStep = st[0].dataValues;
          const customerChallenge = PurchaseMapper
            .toChallengeCustomerEntity(firstStep.challenge.dataValues.challengeCustomers[0]);
          await this.PurchaseStepModel.create({
            purchaseId: purchase.id,
            challengeCustomerId: customerChallenge.id,
            stepId: firstStep.id
          });
        } else {
          const customerChallenge = await this._createCustomerChallenge(ch.id, customerId);
          const purchaseProduct = ch.products.find(p => p.id === productId && !p.isReward);
          await this.PurchaseStepModel.create({
            purchaseId: purchase.id,
            challengeCustomerId: customerChallenge.id,
            stepId: purchaseProduct.stepId
          });
        }
      });
    }));
    return purchase;
  };

  async getForCustomer(customerId) {
    const result = await this.PurchaseModel.findAll({
      where: {customerId},
      include: [
        {model: this.ProductModel}
      ]
    });
    return result.map(PurchaseMapper.toEntity);
  }

  async getForProvider(providerId) {
    const result = await this.PurchaseModel.findAll({
      include: [
        {
          model: this.ProductModel,
          where: {providerId}
        }
      ]
    });
    return result.map(PurchaseMapper.toEntity);
  }

  async getById(id) {
    const purchase = await this._getById(id);
    return PurchaseMapper.toEntity(purchase);
  }

  async remove(id) {
    const purchase = await this._getById(id);

    await purchase.destroy();
    return;
  }

  // Private

  async _createCustomerChallenge(challengeId, customerId) {
    const ccResult = await this.ChallengeCustomerModel.create({
      challengeId,
      customerId
    });
    return PurchaseMapper.toChallengeCustomerEntity(ccResult);
  }

  async _isProductValid(productId, providerId) {
    const productToPurchase = await this.ProductModel.findByPk(productId);
    return productToPurchase.providerId === providerId;
  }

  async _getById(id) {
    try {
      const params = {
        rejectOnEmpty: true,
        include: {
          model: this.ProductModel,
          include: {model: this.ProviderModel}
        }
      };
      return await this.PurchaseModel.findByPk(id, params);
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Purchase with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }
}

module.exports = SequelizePurchasesRepository;
