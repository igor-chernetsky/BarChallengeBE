const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');
const jwt = require('jsonwebtoken');

const ProductsController = {
  get router() {
    const router = Router();
    router.use(inject('productSerializer'));

    router.get('/', inject('getAllProducts'), this.index);
    router.get('/provider/:id', inject('getProviderProducts'), this.indexProvider);
    router.get('/:id', inject('getProduct'), this.show);
    router.post('/', inject('createProduct'), this.create);
    router.put('/:id', inject('updateProduct'), this.update);
    router.delete('/:id', inject('deleteProduct'), this.delete);

    return router;
  },

  index(req, res, next) {
    const { getAllProducts, productSerializer } = req;
    const { SUCCESS, ERROR } = getAllProducts.outputs;
    getAllProducts
      .on(SUCCESS, (products) => {
        res
          .status(Status.OK)
          .json(products.map(productSerializer.serialize));
      })
      .on(ERROR, next);

    getAllProducts.execute();
  },

  indexProvider(req, res, next) {
    const { getProviderProducts, productSerializer } = req;
    const { SUCCESS, ERROR } = getProviderProducts.outputs;
    getProviderProducts
      .on(SUCCESS, (products) => {
        res
          .status(Status.OK)
          .json(products.map(productSerializer.serialize));
      })
      .on(ERROR, next);

    getProviderProducts.execute(Number(req.params.id));
  },

  show(req, res, next) {
    const { getProduct, productSerializer } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getProduct.outputs;

    getProduct
      .on(SUCCESS, (product) => {
        res
          .status(Status.OK)
          .json(productSerializer.serialize(product));
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    getProduct.execute(Number(req.params.id));
  },

  create(req, res, next) {
    const authConfig = req.container.cradle.config.web.auth;
    const { createProduct, productSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, FORBIDDEN } = createProduct.outputs;
    const authData = {
      role: req.role,
      userId: req.userId
    };

    createProduct
      .on(SUCCESS, (product) => {
        const token = jwt.sign({id: product.id, role: 'product'},
          authConfig.secret,
          { expiresIn: '24h' }
        );
        res
          .status(Status.OK)
          .json(productSerializer.serialize(product));
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

    createProduct.execute(req.body, authData);
  },

  update(req, res, next) {
    const { updateProduct, productSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND, FORBIDDEN } = updateProduct.outputs;
    const authData = {
      role: req.role,
      userId: req.userId
    };

    updateProduct
      .on(SUCCESS, (product) => {
        res
          .status(Status.ACCEPTED)
          .json(productSerializer.serialize(product));
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

    updateProduct.execute(Number(req.params.id), req.body, authData);
  },

  delete(req, res, next) {
    const { deleteProduct } = req;
    const { SUCCESS, ERROR,  NOT_FOUND, FORBIDDEN } = deleteProduct.outputs;
    const authData = {
      role: req.role,
      userId: req.userId
    };

    deleteProduct
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

    deleteProduct.execute(Number(req.params.id), authData);
  }
};

module.exports = ProductsController;
