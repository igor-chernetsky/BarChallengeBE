const Operation = require('src/app/Operation');

class DeleteCustomer extends Operation {
  constructor({ customersRepository }) {
    super();
    this.customersRepository = customersRepository;
  }

  async execute(customerId) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

    try {
      await this.customersRepository.remove(customerId);
      this.emit(SUCCESS);
    } catch(error) {
      if(error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

DeleteCustomer.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = DeleteCustomer;
