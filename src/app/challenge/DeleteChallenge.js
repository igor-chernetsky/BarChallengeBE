const Operation = require('src/app/Operation');

class DeleteChallenge extends Operation {
  constructor({ challengesRepository }) {
    super();
    this.challengesRepository = challengesRepository;
  }

  async execute(challengeId, authData) {
    const { SUCCESS, ERROR, NOT_FOUND, FORBIDDEN } = this.outputs;

    const challenge = await this.challengesRepository.getById(challengeId);
    if (challenge && (authData.role !== 'provider' || authData.userId !== challenge.provider.id)) {
      const error = new Error('Forbidden');
      return this.emit(FORBIDDEN, error);
    }

    try {
      await this.challengesRepository.remove(challengeId);
      this.emit(SUCCESS);
    } catch(error) {
      if(error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

DeleteChallenge.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = DeleteChallenge;
