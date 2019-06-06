const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const PurchasesController = {
  get router() {
    const router = Router();
    router.post('/', inject('createPurchase'), this.create);

    return router;
  },

  create(req, res, next) {
    const { createPurchase } = req;
    const { SUCCESS, ERROR } = createPurchase.outputs;


    if (req.role !== 'provider' || !req.userId) {
      const error = new Error('Forbidden');
      return res.status(Status.FORBIDDEN).json({
        type: 'AccessError',
        details: 'You don\'t have access to this action'
      });
    }
    createPurchase
      .on(SUCCESS, (challenges) => {
        res
          .status(Status.OK)
          .json(challenges);
      })
      .on(ERROR, next);
    const {customerId, productId} = req.body;
    createPurchase.execute(Number(customerId), Number(productId), Number(req.userId));
  }
};

module.exports = PurchasesController;
