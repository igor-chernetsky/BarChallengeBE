const Operation = require('src/app/Operation');
const Customer = require('src/domain/user/Customer');

class CreateCustomer extends Operation {
  constructor({ customersRepository }) {
    super();
    this.customersRepository = customersRepository;
  }

  async execute(customerData) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    try {
      const newCustomer = await this.customersRepository.add(customerData);

      this.emit(SUCCESS, newCustomer);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateCustomer.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateCustomer;
