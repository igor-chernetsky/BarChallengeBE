const Operation = require('src/app/Operation');

class GetProduct extends Operation {
  constructor({ productsRepository }) {
    super();
    this.productsRepository = productsRepository;
  }

  async execute(productId) {
    const { SUCCESS, NOT_FOUND } = this.outputs;

    try {
      const product = await this.productsRepository.getById(productId);
      this.emit(SUCCESS, product);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

GetProduct.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetProduct;
