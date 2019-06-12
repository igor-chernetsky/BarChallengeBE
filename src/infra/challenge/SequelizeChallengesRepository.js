const ChallengeMapper = require('./SequelizeChallengeMapper');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
    return challenges.map(ChallengeMapper.toEntity);
  }

  async getCustomerChallenges(customerId) {
    const params = {
      include: {
        model: this.ChallengeModel, include:
        [
          {
            model: this.StepModel,
            include: [
              {model: this.ProductModel},
              {
                model: this.PurchaseStepModel,
                required: false,
                where: Sequelize.where(
                  Sequelize.col('challengeCustomerId'),
                  Sequelize.col('challengeCustomer.id')
                )
              }
            ]
          },
          {
            model: this.ProviderModel,
            attributes: ['id', 'name', 'email', 'description', 'address']
          },
        ]
      },
      where: {customerId, rewardId: null}
    };
    const customerChallenges = await this.ChallengeCustomerModel.findAll(params);
    const challenges = customerChallenges.map(ch => {
      const challenge = ChallengeMapper.toEntity(ch.dataValues.challenge);
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
    const oldChallenge = ChallengeMapper.toEntity(challenge);

    const transaction = await this.ChallengeModel.sequelize.transaction();

    try {
      console.log(newData.products);
      const newSteps = newData.products.filter(np => !np.stepId);
      const delStepsIds = oldChallenge.products
        .filter(op => !newData.products.find(np => op.stepId === np.stepId))
        .map(p => p.stepId);

      const productsList = ChallengeMapper.toStepDatabase(id, newData.products);
      await Promise.all([
        challenge.update(newData, { transaction }),
        this.StepModel.destroy({
          where: {
            id: {
              [Op.in]: delStepsIds
            }
          }
        }, { transaction }),
        this.StepModel
        .bulkCreate(ChallengeMapper.toStepDatabase(id, newSteps), { transaction })
      ]);

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
