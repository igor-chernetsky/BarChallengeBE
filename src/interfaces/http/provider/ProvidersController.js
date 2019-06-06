const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');
const jwt = require('jsonwebtoken');

const ProvidersController = {
  get router() {
    const router = Router();
    router.use(inject('providerSerializer'));

    router.get('/', inject('getAllProviders'), this.index);
    router.post('/login', inject('loginProvider'), this.login);
    router.get('/:id', inject('getProvider'), this.show);
    router.post('/', inject('createProvider'), this.create);
    router.put('/:id', inject('updateProvider'), this.update);
    router.delete('/:id', inject('deleteProvider'), this.delete);

    return router;
  },

  login(req, res, next) {
    const authConfig = req.container.cradle.config.web.auth;
    const { loginProvider, providerSerializer } = req;
    const { SUCCESS, ERROR, NOT_FOUND } = loginProvider.outputs;
    loginProvider
      .on(SUCCESS, (provider) => {
        const token = jwt.sign({id: provider.id, role: 'provider'},
          authConfig.secret,
          { expiresIn: '24h' }
        );
        res
          .status(Status.OK)
          .json({
            token,
            data: providerSerializer.serialize(provider)
          });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);
    loginProvider.execute(req.body.email, req.body.password);
  },

  index(req, res, next) {
    const { getAllProviders, providerSerializer } = req;
    const { SUCCESS, ERROR } = getAllProviders.outputs;
    getAllProviders
      .on(SUCCESS, (providers) => {
        res
          .status(Status.OK)
          .json(providers.map(providerSerializer.serialize));
      })
      .on(ERROR, next);

    getAllProviders.execute();
  },

  show(req, res, next) {
    const { getProvider, providerSerializer } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getProvider.outputs;

    getProvider
      .on(SUCCESS, (provider) => {
        res
          .status(Status.OK)
          .json(providerSerializer.serialize(provider));
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    getProvider.execute(Number(req.params.id));
  },

  create(req, res, next) {
    const authConfig = req.container.cradle.config.web.auth;
    const { createProvider, providerSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createProvider.outputs;

    createProvider
      .on(SUCCESS, (provider) => {
        const token = jwt.sign({id: provider.id, role: 'provider'},
          authConfig.secret,
          { expiresIn: '24h' }
        );
        res
          .status(Status.OK)
          .json({
            token,
            data: providerSerializer.serialize(provider)
          });
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details
        });
      })
      .on(ERROR, next);

    createProvider.execute(req.body);
  },

  update(req, res, next) {
    const { updateProvider, providerSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND } = updateProvider.outputs;

    if (req.role !== 'provider' || +req.userId !== +req.params.id) {
      return res.status(Status.FORBIDDEN).json({
        type: 'AccessError',
        details: 'You don\'t have access to this action'
      });
    }

    updateProvider
      .on(SUCCESS, (provider) => {
        res
          .status(Status.ACCEPTED)
          .json(providerSerializer.serialize(provider));
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details
        });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    updateProvider.execute(Number(req.params.id), req.body);
  },

  delete(req, res, next) {
    const { deleteProvider } = req;
    const { SUCCESS, ERROR,  NOT_FOUND } = deleteProvider.outputs;

    deleteProvider
      .on(SUCCESS, () => {
        res.status(Status.ACCEPTED).end();
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    deleteProvider.execute(Number(req.params.id));
  }
};

module.exports = ProvidersController;
