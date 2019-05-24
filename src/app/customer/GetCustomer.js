const Operation = require('src/app/Operation');

class GetCustomer extends Operation {
  constructor({ customersRepository }) {
    super();
    this.customersRepository = customersRepository;
  }

  async execute(customerId) {
    const { SUCCESS, NOT_FOUND } = this.outputs;

    try {
      const customer = await this.customersRepository.getById(customerId);
      this.emit(SUCCESS, customer);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

GetCustomer.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetCustomer;
