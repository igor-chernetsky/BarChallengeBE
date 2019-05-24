const Operation = require('src/app/Operation');

class GetProvider extends Operation {
  constructor({ providersRepository }) {
    super();
    this.providersRepository = providersRepository;
  }

  async execute(providerId) {
    const { SUCCESS, NOT_FOUND } = this.outputs;

    try {
      const provider = await this.providersRepository.getById(providerId);
      this.emit(SUCCESS, provider);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

GetProvider.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetProvider;
