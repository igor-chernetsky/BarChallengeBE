const ProviderMapper = require('./SequelizeProviderMapper');
const bcrypt = require('bcrypt');

class SequelizeProvidersRepository {
  constructor({ ProviderModel }) {
    this.ProviderModel = ProviderModel;
  }

  async getAll(...args) {
    const providers = await this.ProviderModel.findAll(...args);
    return providers.map(ProviderMapper.toEntity);
  }

  async getById(id) {
    const provider = await this._getById(id);

    return ProviderMapper.toEntity(provider);
  }

  async login(email, password) {
    const provider = await this._login(email, password);

    return ProviderMapper.toEntity(provider);
  }

  async add(provider) {
    const existingUser = await this._getByEmail(provider.email);
    if (existingUser) {
      const error = new Error('UserExistsError');
      error.details = `user with email ${provider.email} already exists`;

      throw error;
    }
    const props = {
      email: provider.email,
      name: provider.name,
      phone: provider.phone,
      address: provider.address,
      passwordHash: provider.passwordHash
    }
    const newProvider = await this.ProviderModel.create(props);
    return ProviderMapper.toEntity(newProvider);
  }

  async remove(id) {
    const provider = await this._getById(id);

    await provider.destroy();
    return;
  }

  async update(id, newData) {
    const provider = await this._getById(id);

    const transaction = await this.ProviderModel.sequelize.transaction();

    try {
      const updatedProvider = await provider.update(newData, { transaction });
      const providerEntity = ProviderMapper.toEntity(updatedProvider);

      const { valid, errors } = providerEntity.validate();

      if(!valid) {
        const error = new Error('ValidationError');
        error.details = errors;

        throw error;
      }

      await transaction.commit();

      return providerEntity;
    } catch(error) {
      await transaction.rollback();

      throw error;
    }
  }

  async count() {
    return await this.ProviderModel.count();
  }

  // Private

  async _getById(id) {
    try {
      return await this.ProviderModel.findById(id, { rejectOnEmpty: true });
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `User with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }

  async _login(email, password) {
    try {
      const provider = await this._getByEmail(email);
      console.log(password);
      console.log(provider.passwordHash);
      const cryptRes = await bcrypt.compare(password, provider.passwordHash);
      if (cryptRes) {
        return provider;
      }
      else {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Wrong Email or Password.`;
        throw notFoundError;
      }
    } catch(error) {
      console.log('errpr', error);
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Wrong Email or Password.`;

        throw notFoundError;
      }

      throw error;
    }
  }

  async _getByEmail(email) {
    try {
      const result = await this.ProviderModel.findOne({where: {email}}, { rejectOnEmpty: true });
      return result;
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `User with email ${email} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }
}

module.exports = SequelizeProvidersRepository;
