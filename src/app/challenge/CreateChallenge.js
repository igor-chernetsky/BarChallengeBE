const Operation = require('src/app/Operation');
const Challenge = require('src/domain/challenge/Challenge');

class CreateChallenge extends Operation {
  constructor({ challengesRepository }) {
    super();
    this.challengesRepository = challengesRepository;
  }

  async execute(challengeData, authData) {
    const { SUCCESS, ERROR, VALIDATION_ERROR, FORBIDDEN } = this.outputs;

    if (authData.role !== 'provider' || authData.userId !== challengeData.provider.id) {
      const error = new Error('Forbidden');
      return this.emit(FORBIDDEN, error);
    }
    try {
      const newChallenge = await this.challengesRepository.add(challengeData);

      this.emit(SUCCESS, newChallenge);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateChallenge.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'FORBIDDEN']);

module.exports = CreateChallenge;
