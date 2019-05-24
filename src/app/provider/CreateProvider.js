const Operation = require('src/app/Operation');
const Provider = require('src/domain/user/Provider');

class CreateProvider extends Operation {
  constructor({ providersRepository }) {
    super();
    this.providersRepository = providersRepository;
  }

  async execute(providerData) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    try {
      const newProvider = await this.providersRepository.add(providerData);

      this.emit(SUCCESS, newProvider);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateProvider.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateProvider;
