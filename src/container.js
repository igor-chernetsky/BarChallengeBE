const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');
const {
  CreateCustomer,
  LoginCustomer,
  GetAllCustomers,
  GetCustomer,
  UpdateCustomer,
  DeleteCustomer
} = require('./app/customer');
const {
  CreateProvider,
  LoginProvider,
  GetAllProviders,
  GetProvider,
  UpdateProvider,
  DeleteProvider
} = require('./app/provider');
const {
  CreateProduct,
  GetAllProducts,
  GetProviderProducts,
  GetProduct,
  UpdateProduct,
  DeleteProduct
} = require('./app/product');

const CustomerSerializer = require('./interfaces/http/customer/CustomerSerializer');
const ProviderSerializer = require('./interfaces/http/provider/ProviderSerializer');
const ProductSerializer = require('./interfaces/http/product/ProductSerializer');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');
const authMiddleware = require('./interfaces/http/auth/authMiddleware');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');
const swaggerMiddleware = require('./interfaces/http/swagger/swaggerMiddleware');

const logger = require('./infra/logging/logger');

const SequelizeCustomersRepository = require('./infra/customer/SequelizeCustomersRepository');
const SequelizeProvidersRepository = require('./infra/provider/SequelizeProvidersRepository');
const SequelizeProductsRepository = require('./infra/product/SequelizeProductsRepository');

const { database,
  Customer: CustomerModel,
  Provider: ProviderModel,
  Product: ProductModel
} = require('./infra/database/models');

const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton()
  })
  .register({
    config: asValue(config)
  });

// Middlewares
container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton()
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    authMiddleware: asValue(authMiddleware),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler),
    swaggerMiddleware: asValue([swaggerMiddleware])
  });

// Repositories
container.register({
  customersRepository: asClass(SequelizeCustomersRepository).singleton(),
  providersRepository: asClass(SequelizeProvidersRepository).singleton(),
  productsRepository: asClass(SequelizeProductsRepository).singleton()
});

// Database
container.register({
  database: asValue(database),
  CustomerModel: asValue(CustomerModel),
  ProviderModel: asValue(ProviderModel),
  ProductModel: asValue(ProductModel)
});

// Operations
container.register({
  createCustomer: asClass(CreateCustomer),
  loginCustomer: asClass(LoginCustomer),
  getAllCustomers: asClass(GetAllCustomers),
  getCustomer: asClass(GetCustomer),
  updateCustomer: asClass(UpdateCustomer),
  deleteCustomer: asClass(DeleteCustomer),

  createProvider: asClass(CreateProvider),
  loginProvider: asClass(LoginProvider),
  getAllProviders: asClass(GetAllProviders),
  getProvider: asClass(GetProvider),
  updateProvider: asClass(UpdateProvider),
  deleteProvider: asClass(DeleteProvider),

  createProduct: asClass(CreateProduct),
  getAllProducts: asClass(GetAllProducts),
  getProviderProducts: asClass(GetProviderProducts),
  getProduct: asClass(GetProduct),
  updateProduct: asClass(UpdateProduct),
  deleteProduct: asClass(DeleteProduct)
});

// Serializers
container.register({
  customerSerializer: asValue(CustomerSerializer),
  providerSerializer: asValue(ProviderSerializer),
  productSerializer: asValue(ProductSerializer)
});

module.exports = container;
