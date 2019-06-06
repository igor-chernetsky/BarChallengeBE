const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const ChallengesController = {
  get router() {
    const router = Router();
    router.use(inject('challengeSerializer'));

    router.get('/', inject('getAllChallenges'), this.index);
    router.get('/provider/:id', inject('getProviderChallenges'), this.indexProvider);
    router.get('/customer/:id', inject('getCustomerChallenges'), this.indexCustomer);
    router.get('/:id', inject('getChallenge'), this.show);
    router.post('/customer', inject('setCustomerChallenge'), this.setCustomerChallenge);
    router.post('/', inject('createChallenge'), this.create);
    router.put('/:id', inject('updateChallenge'), this.update);
    router.delete('/:id', inject('deleteChallenge'), this.delete);

    return router;
  },

  index(req, res, next) {
    const { getAllChallenges, challengeSerializer } = req;
    const { SUCCESS, ERROR } = getAllChallenges.outputs;
    getAllChallenges
      .on(SUCCESS, (challenges) => {
        res
          .status(Status.OK)
          .json(challenges.map(challengeSerializer.serialize));
      })
      .on(ERROR, next);

    getAllChallenges.execute();
  },

  indexProvider(req, res, next) {
    const { getProviderChallenges, challengeSerializer } = req;
    const { SUCCESS, ERROR } = getProviderChallenges.outputs;
    getProviderChallenges
      .on(SUCCESS, (challenges) => {
        res
          .status(Status.OK)
          .json(challenges.map(challengeSerializer.serialize));
      })
      .on(ERROR, next);

    getProviderChallenges.execute(Number(req.params.id));
  },

  indexCustomer(req, res, next) {
    const { getCustomerChallenges, challengeSerializer } = req;
    const { SUCCESS, ERROR } = getCustomerChallenges.outputs;
    getCustomerChallenges
      .on(SUCCESS, (challenges) => {
        res
          .status(Status.OK)
          .json(challenges.map(challengeSerializer.serialize));
      })
      .on(ERROR, next);

    getCustomerChallenges.execute(Number(req.params.id));
  },

  setCustomerChallenge(req, res, next) {
    const { setCustomerChallenge, challengeSerializer } = req;
    const { SUCCESS, ERROR } = setCustomerChallenge.outputs;
    setCustomerChallenge
      .on(SUCCESS, (challenges) => {
        res
          .status(Status.OK)
          .json(challenges.map(challengeSerializer.serialize));
      })
      .on(ERROR, next);
    console.log(req.params);
    const {customerId, productId} = req.body;
    setCustomerChallenge.execute(Number(customerId), Number(productId));
  },

  show(req, res, next) {
    const { getChallenge, challengeSerializer } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getChallenge.outputs;

    getChallenge
      .on(SUCCESS, (challenge) => {
        res
          .status(Status.OK)
          .json(challengeSerializer.serialize(challenge));
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    getChallenge.execute(Number(req.params.id));
  },

  create(req, res, next) {
    const authConfig = req.container.cradle.config.web.auth;
    const { createChallenge, challengeSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, FORBIDDEN } = createChallenge.outputs;
    const authData = {
      role: req.role,
      userId: req.userId
    };

    createChallenge
      .on(SUCCESS, (challenge) => {
        res
          .status(Status.OK)
          .json(challengeSerializer.serialize(challenge));
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details
        });
      })
      .on(FORBIDDEN, (error) => {
        res.status(Status.FORBIDDEN).json({
          type: 'ForbiddenError',
          details: error.details
        });
      })
      .on(ERROR, next);

    createChallenge.execute(req.body, authData);
  },

  update(req, res, next) {
    const { updateChallenge, challengeSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND, FORBIDDEN } = updateChallenge.outputs;
    const authData = {
      role: req.role,
      userId: req.userId
    };

    updateChallenge
      .on(SUCCESS, (challenge) => {
        res
          .status(Status.ACCEPTED)
          .json(challengeSerializer.serialize(challenge));
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
      .on(FORBIDDEN, (error) => {
        res.status(Status.FORBIDDEN).json({
          type: 'ForbiddenError',
          details: error.details
        });
      })
      .on(ERROR, next);

    updateChallenge.execute(Number(req.params.id), req.body, authData);
  },

  delete(req, res, next) {
    const { deleteChallenge } = req;
    const { SUCCESS, ERROR,  NOT_FOUND, FORBIDDEN } = deleteChallenge.outputs;
    const authData = {
      role: req.role,
      userId: req.userId
    };

    deleteChallenge
      .on(SUCCESS, () => {
        res.status(Status.ACCEPTED).end();
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(FORBIDDEN, (error) => {
        res.status(Status.FORBIDDEN).json({
          type: 'ForbiddenError',
          details: error.details
        });
      })
      .on(ERROR, next);

    deleteChallenge.execute(Number(req.params.id), authData);
  }
};

module.exports = ChallengesController;
