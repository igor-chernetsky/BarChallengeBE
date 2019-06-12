const Operation = require('src/app/Operation');

class SetReward extends Operation {
  constructor({ rewardsRepository, productsRepository }) {
    super();
    this.rewardsRepository = rewardsRepository;
    this.productsRepository = productsRepository;
  }

  async execute(data, authData) {
    const { SUCCESS, ERROR } = this.outputs;

    const product = await this.productsRepository.getById(data.rewardId);
    if (authData.role !== 'provider' || authData.userId !== product.provider.id) {
      const error = new Error('Forbidden');
      return this.emit(FORBIDDEN, error);
    }

    try {
      const challenges = await this.rewardsRepository.setReward(data);

      this.emit(SUCCESS, challenges);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

SetReward.setOutputs(['SUCCESS', 'ERROR', 'FORBIDDEN', 'VALIDATION_ERROR']);

module.exports = SetReward;
