const Operation = require('src/app/Operation');

class GetAllProducts extends Operation {
  constructor({ productsRepository }) {
    super();
    this.productsRepository = productsRepository;
  }

  async execute() {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const products = await this.productsRepository.getAll({
        attributes: ['id', 'name', 'image']
      });

      this.emit(SUCCESS, products);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetAllProducts.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllProducts;
