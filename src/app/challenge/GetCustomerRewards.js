const Operation = require('src/app/Operation');

class GetCustomerRewards extends Operation {
  constructor({ challengesRepository }) {
    super();
    this.challengesRepository = challengesRepository;
  }

  async execute(customerId) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const challenges = await this.challengesRepository.getCustomerRewards(customerId);

      this.emit(SUCCESS, challenges);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetCustomerRewards.setOutputs(['SUCCESS', 'ERROR', 'FORBIDDEN']);

module.exports = GetCustomerRewards;
