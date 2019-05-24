const ProductMapper = require('./SequelizeProductMapper');

class SequelizeProductsRepository {
  constructor({ ProductModel }) {
    this.ProductModel = ProductModel;
  }

  async getAll(...args) {
    const provider = this.ProductModel.modelManager.models.find(m => m.name === 'provider');
    console.log('-----------------', args);
    if (args.length) {
      Object.assign(args[0], {include: [{model: provider}]});
    }
    const products = await this.ProductModel.findAll(...args);
    return products.map(ProductMapper.toEntity);
  }

  async getById(id) {
    const product = await this._getById(id);

    return ProductMapper.toEntity(product);
  }

  async add(product) {
    const newProduct = await this.ProductModel.create(ProductMapper.toDatabase(product));
    newProduct.dataValues.provider = product.provider;
    return ProductMapper.toEntity(newProduct);
  }

  async remove(id) {
    const product = await this._getById(id);

    await product.destroy();
    return;
  }

  async update(id, newData) {
    const product = await this._getById(id);

    const transaction = await this.ProductModel.sequelize.transaction();

    try {
      const updatedProduct = await product.update(newData, { transaction });
      const productEntity = ProductMapper.toEntity(updatedProduct);

      const { valid, errors } = productEntity.validate();

      if(!valid) {
        const error = new Error('ValidationError');
        error.details = errors;

        throw error;
      }

      await transaction.commit();

      return productEntity;
    } catch(error) {
      await transaction.rollback();

      throw error;
    }
  }

  async count() {
    return await this.ProductModel.count();
  }

  // Private

  async _getById(id) {
    try {
      return await this.ProductModel.findById(id, { rejectOnEmpty: true });
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Product with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }
}

module.exports = SequelizeProductsRepository;
