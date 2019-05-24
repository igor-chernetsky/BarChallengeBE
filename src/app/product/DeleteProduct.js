const Operation = require('src/app/Operation');

class DeleteProduct extends Operation {
  constructor({ productsRepository }) {
    super();
    this.productsRepository = productsRepository;
  }

  async execute(productId, authData) {
    const { SUCCESS, ERROR, NOT_FOUND, FORBIDDEN } = this.outputs;

    const product = await this.productsRepository.getById(productId);
    if (product && (authData.role !== 'provider' || authData.userId !== product.provider.id)) {
      const error = new Error('Forbidden');
      return this.emit(FORBIDDEN, error);
    }

    try {
      await this.productsRepository.remove(productId);
      this.emit(SUCCESS);
    } catch(error) {
      if(error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

DeleteProduct.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = DeleteProduct;
