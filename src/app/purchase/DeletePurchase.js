const Operation = require('src/app/Operation');

class DeletePurchase extends Operation {
  constructor({ purchasesRepository }) {
    super();
    this.purchasesRepository = purchasesRepository;
  }

  async execute(purchaseId, authData) {
    const { SUCCESS, ERROR, NOT_FOUND, FORBIDDEN } = this.outputs;

    const purchase = await this.purchasesRepository.getById(purchaseId);
    if (purchase && (authData.role !== 'provider' || authData.userId !== purchase.product.provider.id)) {
      const error = new Error('Forbidden');
      return this.emit(FORBIDDEN, error);
    }

    try {
      await this.purchasesRepository.remove(purchaseId);
      this.emit(SUCCESS);
    } catch(error) {
      if(error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

DeletePurchase.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = DeletePurchase;
