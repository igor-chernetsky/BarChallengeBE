const Operation = require('src/app/Operation');

class GetCustomerChallenges extends Operation {
  constructor({ challengesRepository }) {
    super();
    this.challengesRepository = challengesRepository;
  }

  async execute(customerId) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const challenges = await this.challengesRepository.getCustomerChallenges(customerId, {
        attributes: ['id', 'name', 'description']
      });

      this.emit(SUCCESS, challenges);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetCustomerChallenges.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetCustomerChallenges;
