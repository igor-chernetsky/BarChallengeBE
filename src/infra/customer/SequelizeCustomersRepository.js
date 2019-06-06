const CustomerMapper = require('./SequelizeCustomerMapper');
const bcrypt = require('bcrypt');

class SequelizeCustomersRepository {
  constructor({ CustomerModel }) {
    this.CustomerModel = CustomerModel;
  }

  async getAll(...args) {
    const customers = await this.CustomerModel.findAll(...args);
    return customers.map(CustomerMapper.toEntity);
  }

  async getById(id) {
    const customer = await this._getById(id);

    return CustomerMapper.toEntity(customer);
  }

  async login(email, password) {
    const customer = await this._login(email, password);

    return CustomerMapper.toEntity(customer);
  }

  async add(customer) {
    const existingUser = await this._getByEmail(customer.email);
    if (existingUser) {
      const error = new Error('UserExistsError');
      error.details = `user with email ${customer.email} already exists`;

      throw error;
    }
    const props = {
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      passwordHash: customer.passwordHash
    }
    const newCustomer = await this.CustomerModel.create(props);
    return CustomerMapper.toEntity(newCustomer);
  }

  async remove(id) {
    const customer = await this._getById(id);

    await customer.destroy();
    return;
  }

  async update(id, newData) {
    const customer = await this._getById(id);

    const transaction = await this.CustomerModel.sequelize.transaction();

    try {
      const updatedCustomer = await customer.update(newData, { transaction });
      const customerEntity = CustomerMapper.toEntity(updatedCustomer);

      const { valid, errors } = customerEntity.validate();

      if(!valid) {
        const error = new Error('ValidationError');
        error.details = errors;

        throw error;
      }

      await transaction.commit();

      return customerEntity;
    } catch(error) {
      await transaction.rollback();

      throw error;
    }
  }

  async count() {
    return await this.CustomerModel.count();
  }

  // Private

  async _getById(id) {
    try {
      return await this.CustomerModel.findByPk(id, { rejectOnEmpty: true });
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
      const customer = await this._getByEmail(email);
      const cryptRes = await bcrypt.compare(password, customer.passwordHash);
      if (cryptRes) {
        return customer;
      }
      else {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Wrong Email or Password.`;
        throw notFoundError;
      }
    } catch(error) {
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
      const result = await this.CustomerModel.findOne({where: {email}}, { rejectOnEmpty: true });
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

module.exports = SequelizeCustomersRepository;
