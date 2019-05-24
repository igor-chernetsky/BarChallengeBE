const Operation = require('src/app/Operation');

class GetAllCustomers extends Operation {
  constructor({ customersRepository }) {
    super();
    this.customersRepository = customersRepository;
  }

  async execute() {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const customers = await this.customersRepository.getAll({
        attributes: ['id', 'name', 'email', 'phone']
      });

      this.emit(SUCCESS, customers);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetAllCustomers.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllCustomers;
