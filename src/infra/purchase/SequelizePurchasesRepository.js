const ChallengeMapper = require('../challenge/SequelizeChallengeMapper');
const PurchaseMapper = require('./SequelizePurchaseMapper');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class SequelizePurchasesRepository {
  constructor({ ChallengeModel, StepModel, ProductModel,
    ProviderModel, ChallengeCustomerModel, PurchaseModel }) {
    this.ChallengeModel = ChallengeModel;
    this.ProviderModel = ProviderModel;
    this.ProductModel = ProductModel;
    this.StepModel = StepModel;
    this.ChallengeCustomerModel = ChallengeCustomerModel;
    this.PurchaseModel = PurchaseModel;
  }

  async create(customerId, productId, providerId) {
    const params = {include: [
        {model: this.ProviderModel, attributes: []},
        {model: this.StepModel, where: {isReward: false}, include: {model: this.ProductModel}}
      ]};
    const providerChallenges = await this.ChallengeModel.findAll(params).map(ChallengeMapper.toEntity);
    await Promise.all(providerChallenges.map(ch => {
      const stepIds = ch.products.filter(p => p.id === productId).map(p => p.stepId);
      return this.ChallengeCustomerModel.findOne({
        where: {
          challengeId: ch.id,
          customerId, rewardId: null,
          stepsLeft: {[Op.overlap]: stepIds}
        }
      })
      .then(cc => {
        if (cc) {
          const customerChallenge = PurchaseMapper.toChallengeCustomerEntity(cc);
          const stepIds = ch.products.filter(p => p.id === productId).map(p => p.stepId);
          const removeIndex = customerChallenge.stepsLeft.findIndex(s => stepIds.indexOf(s));
          customerChallenge.stepsLeft.splice(removeIndex, 1);
          console.log(PurchaseMapper.toChallengeCustomerDatabase(customerChallenge));
          cc.update(PurchaseMapper.toChallengeCustomerDatabase(customerChallenge));
        } else {
          const removeIndex = ch.products.findIndex(p => p.id === productId);
          ch.products.splice(removeIndex, 1);
          const stepsLeft = ch.products.map(p => p.stepId);
          const createParams = {
            challengeId: ch.id,
            customerId,
            stepsLeft
          };
          this.ChallengeCustomerModel.create(PurchaseMapper.toChallengeCustomerDatabase(createParams));
        }
      })
    }));

    console.log('----------------', {customerId, productId})
    const purchase = await this.PurchaseModel.create({customerId, productId});
    return PurchaseMapper.toEntity(purchase);
  }

  // Private
}

module.exports = SequelizePurchasesRepository;
