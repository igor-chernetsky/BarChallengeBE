const Operation = require('src/app/Operation');

class GetRewards extends Operation {
  constructor({ challengesRepository }) {
    super();
    this.challengesRepository = challengesRepository;
  }

  async execute(providerId) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const challenges = await this.challengesRepository.getRewards(providerId);

      this.emit(SUCCESS, challenges);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetRewards.setOutputs(['SUCCESS', 'ERROR', 'FORBIDDEN']);

module.exports = GetRewards;
