const { Router } = require('express');
const statusMonitor = require('express-status-monitor');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const controller = require('./utils/createControllerRoutes');

module.exports = ({
  config,
  containerMiddleware,
  loggerMiddleware,
  authMiddleware,
  errorHandler,
  swaggerMiddleware }) => {
  const router = Router();

  /* istanbul ignore if */
  if(config.env === 'development') {
    router.use(statusMonitor());
  }

  /* istanbul ignore if */
  if(config.env !== 'test') {
    router.use(loggerMiddleware);
  }


  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(compression())
    .use(containerMiddleware)
    .use(authMiddleware)
    .use('/docs', swaggerMiddleware);

  /*
   * Add your API routes here
   *
   * You can use the `controllers` helper like this:
   * apiRouter.use('/users', controller(controllerPath))
   *
   * The `controllerPath` is relative to the `interfaces/http` folder
   */

  apiRouter.use('/customers', controller('customer/CustomersController'));
  apiRouter.use('/providers', controller('provider/ProvidersController'));
  apiRouter.use('/products', controller('product/ProductsController'));
  apiRouter.use('/challenges', controller('challenge/ChallengesController'));
  apiRouter.use('/purchases', controller('purchase/PurchasesController'));
  apiRouter.use('/rewards', controller('reward/RewardsController'));
  apiRouter.use('/image', controller('uploader/UploaderController'));

  router.use('/api', apiRouter);

  router.use(errorHandler);

  return router;
};
