const Operation = require('src/app/Operation');

class LoginCustomer extends Operation {
  constructor({ customersRepository }) {
    super();
    this.customersRepository = customersRepository;
  }

  async execute(email, password) {
    const { SUCCESS, NOT_FOUND } = this.outputs;

    try {
      const customer = await this.customersRepository.login(email, password);
      this.emit(SUCCESS, customer);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

LoginCustomer.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = LoginCustomer;
