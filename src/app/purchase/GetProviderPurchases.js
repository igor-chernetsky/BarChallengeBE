const Operation = require('src/app/Operation');

class GetProviderPurchases extends Operation {
  constructor({ purchasesRepository }) {
    super();
    this.purchasesRepository = purchasesRepository;
  }

  async execute(providerId) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const purchases = await this.purchasesRepository.getForProvider(providerId);

      this.emit(SUCCESS, purchases);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetProviderPurchases.setOutputs(['SUCCESS', 'ERROR', 'FORBIDDEN']);

module.exports = GetProviderPurchases;
