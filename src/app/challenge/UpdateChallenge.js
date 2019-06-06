const Operation = require('src/app/Operation');

class UpdateChallenge extends Operation {
  constructor({ challengesRepository }) {
    super();
    this.challengesRepository = challengesRepository;
  }

  async execute(challengeId, challengeData, authData) {
    const {
      SUCCESS, NOT_FOUND, VALIDATION_ERROR, ERROR, FORBIDDEN
    } = this.outputs;

    if (authData.role !== 'provider' || authData.userId !== challengeData.provider.id) {
      const error = new Error('Forbidden');
      return this.emit(FORBIDDEN, error);
    }

    try {
      const challenge = await this.challengesRepository.update(challengeId, challengeData);
      challenge.provider = challengeData.provider;
      this.emit(SUCCESS, challenge);
    } catch(error) {
      switch(error.message) {
      case 'ValidationError':
        return this.emit(VALIDATION_ERROR, error);
      case 'NotFoundError':
        return this.emit(NOT_FOUND, error);
      default:
        this.emit(ERROR, error);
      }
    }
  }
}

UpdateChallenge.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR', 'FORBIDDEN']);

module.exports = UpdateChallenge;
