const Operation = require('src/app/Operation');

class GetProviderRewards extends Operation {
  constructor({ rewardsRepository }) {
    super();
    this.rewardsRepository = rewardsRepository;
  }

  async execute(providerId) {
    const { SUCCESS, ERROR } = this.outputs;

    if (authData.role !== 'provider' || authData.userId !== productData.provider.id) {
      const error = new Error('Forbidden');
      return this.emit(FORBIDDEN, error);
    }

    try {
      const challenges = await this.rewardsRepository.getProviderRewards(providerId);

      this.emit(SUCCESS, challenges);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetProviderRewards.setOutputs(['SUCCESS', 'ERROR', 'FORBIDDEN']);

module.exports = GetProviderRewards;
