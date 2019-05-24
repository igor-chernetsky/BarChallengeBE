const Operation = require('src/app/Operation');

class DeleteProvider extends Operation {
  constructor({ providersRepository }) {
    super();
    this.providersRepository = providersRepository;
  }

  async execute(providerId) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

    try {
      await this.providersRepository.remove(providerId);
      this.emit(SUCCESS);
    } catch(error) {
      if(error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

DeleteProvider.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = DeleteProvider;
