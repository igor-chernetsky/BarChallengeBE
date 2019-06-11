const Operation = require('src/app/Operation');

class GetProviderRewards extends Operation {
  constructor({ challengesRepository }) {
    super();
    this.challengesRepository = challengesRepository;
  }

  async execute(providerId) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const challenges = await this.challengesRepository.getProviderRewards(providerId);

      this.emit(SUCCESS, challenges);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetProviderRewards.setOutputs(['SUCCESS', 'ERROR', 'FORBIDDEN']);

module.exports = GetProviderRewards;
