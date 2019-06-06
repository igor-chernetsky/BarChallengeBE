const Operation = require('src/app/Operation');

class GetAllChallenges extends Operation {
  constructor({ challengesRepository }) {
    super();
    this.challengesRepository = challengesRepository;
  }

  async execute() {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const challenges = await this.challengesRepository.getAll({
        attributes: ['id', 'name', 'description']
      });

      this.emit(SUCCESS, challenges);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetAllChallenges.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllChallenges;
