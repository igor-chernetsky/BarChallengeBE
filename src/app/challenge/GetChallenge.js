const Operation = require('src/app/Operation');

class GetChallenge extends Operation {
  constructor({ challengesRepository }) {
    super();
    this.challengesRepository = challengesRepository;
  }

  async execute(challengeId) {
    const { SUCCESS, NOT_FOUND } = this.outputs;

    try {
      const challenge = await this.challengesRepository.getById(challengeId);
      this.emit(SUCCESS, challenge);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

GetChallenge.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetChallenge;
