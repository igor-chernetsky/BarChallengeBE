const Operation = require('src/app/Operation');

class UpdateProduct extends Operation {
  constructor({ productsRepository }) {
    super();
    this.productsRepository = productsRepository;
  }

  async execute(productId, productData, authData) {
    const {
      SUCCESS, NOT_FOUND, VALIDATION_ERROR, ERROR, FORBIDDEN
    } = this.outputs;

    if (authData.role !== 'provider' || authData.userId !== productData.provider.id) {
      const error = new Error('Forbidden');
      return this.emit(FORBIDDEN, error);
    }

    try {
      const product = await this.productsRepository.update(productId, productData);
      product.provider = productData.provider;
      this.emit(SUCCESS, product);
    } catch(error) {
      switch(error.message) {
      case 'ValidationError':
        return this.emit(VALIDATION_ERROR, error);
      case 'NotFoundError':
        return this.emit(NOT_FOUND, error);
      default:
        this.emit(ERROR, error);
      }
    }
  }
}

UpdateProduct.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR', 'FORBIDDEN']);

module.exports = UpdateProduct;
