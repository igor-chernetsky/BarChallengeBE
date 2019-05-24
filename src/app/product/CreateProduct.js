const Operation = require('src/app/Operation');
const Product = require('src/domain/product/Product');

class CreateProduct extends Operation {
  constructor({ productsRepository }) {
    super();
    this.productsRepository = productsRepository;
  }

  async execute(productData, authData) {
    const { SUCCESS, ERROR, VALIDATION_ERROR, FORBIDDEN } = this.outputs;

    if (authData.role !== 'provider' || authData.userId !== productData.provider.id) {
      const error = new Error('Forbidden');
      return this.emit(FORBIDDEN, error);
    }
    try {
      const newProduct = await this.productsRepository.add(productData);

      this.emit(SUCCESS, newProduct);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateProduct.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'FORBIDDEN']);

module.exports = CreateProduct;
