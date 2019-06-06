const Operation = require('src/app/Operation');

class GetProviderChallenges extends Operation {
  constructor({ challengesRepository }) {
    super();
    this.challengesRepository = challengesRepository;
  }

  async execute(providerId) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const challenges = await this.challengesRepository.getAll(
        { attributes: ['id', 'name', 'description'], where: { providerId } });

      this.emit(SUCCESS, challenges);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetProviderChallenges.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetProviderChallenges;
