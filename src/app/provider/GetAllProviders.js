const Operation = require('src/app/Operation');

class GetAllProviders extends Operation {
  constructor({ providersRepository }) {
    super();
    this.providersRepository = providersRepository;
  }

  async execute() {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const providers = await this.providersRepository.getAll({
        attributes: ['id', 'name', 'email', 'address', 'logo', 'description']
      });

      this.emit(SUCCESS, providers);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetAllProviders.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllProviders;
