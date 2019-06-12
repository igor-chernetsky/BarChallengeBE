const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const RewardsController = {
  get router() {
    const router = Router();
    router.use(inject('challengeSerializer'));

    router.get('/:id', inject('getCustomerRewards'), this.index);
    router.get('/provider/:id', inject('getProviderRewards'), this.indexProvider);
    router.post('/', inject('setReward'), this.setCustomerReward)

    return router;
  },

  index(req, res, next) {
    const { getCustomerRewards, challengeSerializer } = req;
    const { SUCCESS, ERROR } = getCustomerRewards.outputs;
    getCustomerRewards
      .on(SUCCESS, (challenges) => {
        res
          .status(Status.OK)
          .json(challenges.map(challengeSerializer.serialize));
      })
      .on(ERROR, next);

    getCustomerRewards.execute(Number(req.params.id));
  },

  indexProvider(req, res, next) {
    const { getProviderRewards, challengeSerializer } = req;
    const { SUCCESS, ERROR } = getProviderRewards.outputs;
    const authData = {
      role: req.role,
      userId: req.userId
    };
    getProviderRewards
      .on(SUCCESS, (challenges) => {
        res
          .status(Status.OK)
          .json(challenges.map(challengeSerializer.serialize));
      })
      .on(ERROR, next);

    getProviderRewards.execute(Number(req.params.id, authData));
  },

  setCustomerReward(req, res, next) {
    const authConfig = req.container.cradle.config.web.auth;
    const { setReward, productSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, FORBIDDEN } = setReward.outputs;
    const authData = {
      role: req.role,
      userId: req.userId
    };

    setReward
      .on(SUCCESS, (result) => {
        res
          .status(Status.OK)
          .json(result);
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

    setReward.execute(req.body, authData);
  }
};

module.exports = RewardsController;
