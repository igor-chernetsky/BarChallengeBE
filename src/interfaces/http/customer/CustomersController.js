const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');
const jwt = require('jsonwebtoken');

const CustomersController = {
  get router() {
    const router = Router();
    router.use(inject('customerSerializer'));

    router.get('/', inject('getAllCustomers'), this.index);
    router.post('/login', inject('loginCustomer'), this.login);
    router.get('/:id', inject('getCustomer'), this.show);
    router.post('/', inject('createCustomer'), this.create);
    router.put('/:id', inject('updateCustomer'), this.update);
    router.delete('/:id', inject('deleteCustomer'), this.delete);

    return router;
  },

  index(req, res, next) {
    const { getAllCustomers, customerSerializer } = req;
    const { SUCCESS, ERROR } = getAllCustomers.outputs;

    getAllCustomers
      .on(SUCCESS, (customers) => {
        res
          .status(Status.OK)
          .json(customers.map(customerSerializer.serialize));
      })
      .on(ERROR, next);

    getAllCustomers.execute();
  },

  login(req, res, next) {
    const authConfig = req.container.cradle.config.web.auth;
    const { loginCustomer, customerSerializer } = req;
    const { SUCCESS, ERROR, NOT_FOUND } = loginCustomer.outputs;
    loginCustomer
      .on(SUCCESS, (customer) => {
        const token = jwt.sign({id: customer.id, role: 'customer'},
          authConfig.secret,
          { expiresIn: '24h' }
        );
        res
          .status(Status.OK)
          .json({
            token,
            data: customerSerializer.serialize(customer)
          });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);
    loginCustomer.execute(req.body.email, req.body.password);
  },

  show(req, res, next) {
    const { getCustomer, customerSerializer } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getCustomer.outputs;

    getCustomer
      .on(SUCCESS, (customer) => {
        res
          .status(Status.OK)
          .json(customerSerializer.serialize(customer));
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    getCustomer.execute(Number(req.params.id));
  },

  create(req, res, next) {
    const authConfig = req.container.cradle.config.web.auth;
    const { createCustomer, customerSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createCustomer.outputs;

    createCustomer
      .on(SUCCESS, (customer) => {
        const token = jwt.sign({id: customer.id, role: 'customer'},
          authConfig.secret,
          { expiresIn: '24h' }
        );
        res
          .status(Status.OK)
          .json({
            token,
            data: customerSerializer.serialize(customer)
          });
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details
        });
      })
      .on(ERROR, next);

    createCustomer.execute(req.body);
  },

  update(req, res, next) {
    const { updateCustomer, customerSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND } = updateCustomer.outputs;

    if (!req.role === 'customer' || req.id !== req.params.id) {
      return res.status(Status.FORBIDDEN).json({
        type: 'You don\'t have access to this action'
      });
    }

    updateCustomer
      .on(SUCCESS, (customer) => {
        res
          .status(Status.ACCEPTED)
          .json(customerSerializer.serialize(customer));
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

    updateCustomer.execute(Number(req.params.id), req.body);
  },

  delete(req, res, next) {
    const { deleteCustomer } = req;
    const { SUCCESS, ERROR,  NOT_FOUND } = deleteCustomer.outputs;

    deleteCustomer
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

    deleteCustomer.execute(Number(req.params.id));
  }
};

module.exports = CustomersController;
