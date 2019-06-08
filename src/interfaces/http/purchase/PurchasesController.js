const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const PurchasesController = {
  get router() {
    const router = Router();
    router.post('/', inject('createPurchase'), this.create);
    router.get('/customer/:id', inject('getCustomerPurchases'), this.customerIndex);
    router.get('/provider/:id', inject('getProviderPurchases'), this.providerIndex);
    router.delete('/:id', inject('deletePurchase'), this.delete);

    return router;
  },

  customerIndex(req, res, next) {
    const { getCustomerPurchases } = req;
    const { SUCCESS, ERROR, FORBIDDEN } = getCustomerPurchases.outputs;

    console.log(req.role, req.userId, req.params.id)
    if (req.role !== 'customer' || +req.userId !== +req.params.id) {
      return res.status(Status.FORBIDDEN).json({
        type: 'AccessError',
        details: 'You don\'t have access to this action'
      });
    }

    getCustomerPurchases
      .on(SUCCESS, (purchases) => {
        res
          .status(Status.OK)
          .json(purchases);
      })
      .on(ERROR, next);

    getCustomerPurchases.execute(Number(req.params.id));
  },

  providerIndex(req, res, next) {
    const { getProviderPurchases } = req;
    const { SUCCESS, ERROR, FORBIDDEN } = getProviderPurchases.outputs;

    if (req.role !== 'provider' || +req.userId !== +req.params.id) {
      return res.status(Status.FORBIDDEN).json({
        type: 'AccessError',
        details: 'You don\'t have access to this action'
      });
    }

    getProviderPurchases
      .on(SUCCESS, (purchases) => {
        res
          .status(Status.OK)
          .json(purchases);
      })
      .on(ERROR, next);

    getProviderPurchases.execute(Number(req.params.id));
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
  },

  delete(req, res, next) {
    const { deletePurchase } = req;
    const { SUCCESS, ERROR,  NOT_FOUND, FORBIDDEN } = deletePurchase.outputs;
    const authData = {
      role: req.role,
      userId: req.userId
    };

    deletePurchase
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

    deletePurchase.execute(Number(req.params.id), authData);
  }
};

module.exports = PurchasesController;
