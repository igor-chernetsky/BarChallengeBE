const ChallengeMapper = require('../challenge/SequelizeChallengeMapper');
const PurchaseMapper = require('./SequelizePurchaseMapper');
const Sequelize = require('sequelize');

class SequelizePurchasesRepository {
  constructor({ ChallengeModel, StepModel, ProductModel,
    ProviderModel, ChallengeCustomerModel, PurchaseModel, PurchaseStepModel }) {
    this.ChallengeModel = ChallengeModel;
    this.ProviderModel = ProviderModel;
    this.ProductModel = ProductModel;
    this.StepModel = StepModel;
    this.ChallengeCustomerModel = ChallengeCustomerModel;
    this.PurchaseModel = PurchaseModel;
    this.PurchaseStepModel = PurchaseStepModel;
  }

  async create(customerId, productId, providerId) {
    const params = {include: [
        {model: this.StepModel, where: {isReward: false}, include: {model: this.ProductModel}}
      ]};
    const providerChallenges = await this.ChallengeModel.findAll(params).map(ChallengeMapper.toEntity);

    const createResult = await this.PurchaseModel.create({customerId, productId});
    const purchase = PurchaseMapper.toEntity(createResult);
    await Promise.all(providerChallenges.map(ch => {
      const stepIds = ch.products.filter(p => p.id === productId).map(p => p.stepId);
      this.StepModel.findAll({
        include: [{
          model: this.ChallengeModel, include: {
            model: this.ChallengeCustomerModel,
            where: {customerId, rewardId: null},
          }
        }, {
          model: this.PurchaseStepModel,
          required: false
        }],
        where: {
          challengeId: ch.id,
          productId,
          isReward: false,
          '$challenge.id$': ch.id,
          '$purchaseSteps.id$': null }
      })
      .then(async cc => {
        if (cc && cc.length) {
          const firstStep = cc[0].dataValues;
          const customerChallenge = PurchaseMapper
            .toChallengeCustomerEntity(firstStep.challenge.dataValues.challengeCustomers[0]);
          await this.PurchaseStepModel.create({
            purchaseId: purchase.id,
            challengeCustomerId: customerChallenge.id,
            stepId: firstStep.id
          });
        } else {
          const customerChallenge = await this._createCustomerChallenge(ch.id, customerId);
          const purchaseProduct = ch.products.find(p => p.id === productId);
          await this.PurchaseStepModel.create({
            purchaseId: purchase.id,
            challengeCustomerId: customerChallenge.id,
            stepId: purchaseProduct.stepId
          });
        }
      })
    }));
    return purchase;
  }

  // Private

  async _createCustomerChallenge(challengeId, customerId) {
    const ccResult = await this.ChallengeCustomerModel.create({
      challengeId,
      customerId
    });
    return PurchaseMapper.toChallengeCustomerEntity(ccResult);
  }
}

module.exports = SequelizePurchasesRepository;
