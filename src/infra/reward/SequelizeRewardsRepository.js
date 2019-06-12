const ChallengeMapper = require('../challenge/SequelizeChallengeMapper');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class SequelizeRewardsRepository {
  constructor({ ChallengeModel, StepModel, ProductModel,
    ProviderModel, CustomerModel, ChallengeCustomerModel, PurchaseStepModel }) {
    this.ChallengeModel = ChallengeModel;
    this.ProviderModel = ProviderModel;
    this.ProductModel = ProductModel;
    this.CustomerModel = CustomerModel;
    this.StepModel = StepModel;
    this.ChallengeCustomerModel = ChallengeCustomerModel;
    this.PurchaseStepModel = PurchaseStepModel;
  }

  async getProviderRewards(providerId) {
    const result = await this.ChallengeCustomerModel.findAll({
      include: {
        model: this.ChallengeModel,
        where: {providerId},
        include: {
          model: this.StepModel,
          include: [{
            model: this.PurchaseStepModel,
            required: false,
            where: Sequelize.where(
              Sequelize.col('challengeCustomerId'),
              Sequelize.col('challengeCustomer.id')
            )
          },{
            model: this.ProductModel
          }]
        }
      },
      where: {rewardId: null}
    });
    let challenges = result.map(cc => {
      return ChallengeMapper.toEntity(cc.dataValues.challenge);
    });
    challenges = challenges.filter(ch => {
      return !ch.products.find(p => (p.status !== 'done' && !p.isReward));
    });
    return challenges;
  }

  async getCustomerRewards(customerId) {
    const result = await this.ChallengeCustomerModel.findAll({
      include: {
        model: this.ChallengeModel,
        include: {
          model: this.StepModel,
          include: [{
            model: this.PurchaseStepModel,
            required: false,
            where: Sequelize.where(
              Sequelize.col('challengeCustomerId'),
              Sequelize.col('challengeCustomer.id')
            )
          },{
            model: this.ProductModel
          }]
        }
      },
      where: {rewardId: null, customerId}
    });
    let challenges = result.map(cc => {
      return ChallengeMapper.toEntity(cc.dataValues.challenge);
    });
    challenges = challenges.filter(ch => {
      return !ch.products.find(p => (p.status !== 'done' && !p.isReward));
    });
    return challenges;
  }

  async setReward(data) {
    const {challengeId, customerId, rewardId} = data;
    if (!rewardId) {
      const error = new Error('ValidationError');
      throw error;
    }
    const result = await this.ChallengeCustomerModel.update({rewardId}, {where: {challengeId, customerId}});
    return result;
  }

  // Private
}

module.exports = SequelizeRewardsRepository;
