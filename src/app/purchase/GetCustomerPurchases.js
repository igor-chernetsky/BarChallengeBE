const Operation = require('src/app/Operation');

class GetCustomerPurchases extends Operation {
  constructor({ purchasesRepository }) {
    super();
    this.purchasesRepository = purchasesRepository;
  }

  async execute(customerId) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const purchases = await this.purchasesRepository.getForCustomer(customerId);

      this.emit(SUCCESS, purchases);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetCustomerPurchases.setOutputs(['SUCCESS', 'ERROR', 'FORBIDDEN']);

module.exports = GetCustomerPurchases;
