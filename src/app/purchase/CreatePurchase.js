const Operation = require('src/app/Operation');

class CreatePurchase extends Operation {
  constructor({ purchasesRepository }) {
    super();
    this.purchasesRepository = purchasesRepository;
  }

  async execute(customerId, productId, providerId) {
    const { SUCCESS, ERROR } = this.outputs;
    try {
      const challenges = await this.purchasesRepository.create(customerId, productId, providerId);

      this.emit(SUCCESS, challenges);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

CreatePurchase.setOutputs(['SUCCESS', 'ERROR', 'FORBIDDEN']);

module.exports = CreatePurchase;
