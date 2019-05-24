const Operation = require('src/app/Operation');

class GetProviderProducts extends Operation {
  constructor({ productsRepository }) {
    super();
    this.productsRepository = productsRepository;
  }

  async execute(providerId) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const products = await this.productsRepository.getAll(
        { attributes: ['id', 'name', 'image'], where: { providerId } });

      this.emit(SUCCESS, products);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetProviderProducts.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetProviderProducts;
