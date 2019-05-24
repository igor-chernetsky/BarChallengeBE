const Operation = require('src/app/Operation');

class LoginProvider extends Operation {
  constructor({ providersRepository }) {
    super();
    this.providersRepository = providersRepository;
  }

  async execute(email, password) {
    const { SUCCESS, NOT_FOUND } = this.outputs;

    try {
      const provider = await this.providersRepository.login(email, password);
      this.emit(SUCCESS, provider);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

LoginProvider.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = LoginProvider;
