const ChallengeMapper = require('./SequelizeChallengeMapper');
const Sequelize = require('sequelize');

class SequelizeChallengesRepository {
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

  async getAll(...args) {
    if (args.length) {
      Object.assign(args[0], {include: [
        {model: this.ProviderModel, attributes: ['id', 'name', 'email', 'description', 'address']},
        {model: this.StepModel, include: {model: this.ProductModel}}
      ]});
    }

    const challenges = await this.ChallengeModel.findAll(...args);
    console.log(challenges);
    return challenges.map(ChallengeMapper.toEntity);
  }

  async getCustomerChallenges(customerId) {
    const params = {
      include: [{
        model: this.ChallengeModel, include:
        [
          {
            model: this.StepModel,
            include: [
              {model: this.ProductModel}
            ]
          },
          {
            model: this.ProviderModel,
            attributes: ['id', 'name', 'email', 'description', 'address']
          },
        ]
      }, {
        model: this.PurchaseStepModel,
        required: false,
      }],
      where: {customerId}
    };
    const customerChallenges = await this.ChallengeCustomerModel.findAll(params);
    const challenges = customerChallenges.map(ch => {
      const challenge = ChallengeMapper.toEntity(ch.dataValues.challenge);
      const purchasedSteps = ch.dataValues.purchaseSteps.filter(ps => {
        return ps.dataValues.challengeCustomerId === ch.dataValues.id;
      });
      challenge.products.forEach(p => {
        if (purchasedSteps.find(ps => ps.dataValues.stepId === p.stepId)) p.status = 'done';
      });
      return challenge;
    });

    return challenges;
  }

  async getById(id) {
    const challenge = await this._getById(id);
    return ChallengeMapper.toEntity(challenge);
  }

  async add(challenge) {
    const newChallenge = await this.ChallengeModel.create(ChallengeMapper.toDatabase(challenge));

    const productsList = ChallengeMapper.toStepDatabase(newChallenge.dataValues.id, challenge.products);
    await this.StepModel.bulkCreate(productsList);
    return this.getById(newChallenge.id);
  }

  async remove(id) {
    const challenge = await this._getById(id);

    await challenge.destroy();
    return;
  }

  async update(id, newData) {
    const challenge = await this._getById(id);

    const transaction = await this.ChallengeModel.sequelize.transaction();

    try {
      const updatedChallenge = await challenge.update(newData, { transaction });

      const productsList = ChallengeMapper.toStepDatabase(id, newData.products);
      await this.StepModel.destroy({where: {challengeId: id}});
      await this.StepModel.bulkCreate(productsList);
      const challengeEntity = ChallengeMapper.toEntity(updatedChallenge);

      await transaction.commit();

      return this.getById(id);
    } catch(error) {
      await transaction.rollback();

      throw error;
    }
  }

  async count() {
    return await this.ChallengeModel.count();
  }

  // Private

  async _getById(challengeId) {
    try {
      const params = {include: [
        {model: this.ProviderModel, attributes: ['id', 'name', 'email', 'description', 'address']},
        {model: this.StepModel, include: {model: this.ProductModel}}
      ]};
      return await this.ChallengeModel.findByPk(challengeId, params);
    } catch(error) {
      console.log(error);
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Challenge with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }
}

module.exports = SequelizeChallengesRepository;
