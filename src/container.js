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
const {
  CreateChallenge,
  GetAllChallenges,
  GetProviderChallenges,
  GetCustomerChallenges,
  GetChallenge,
  UpdateChallenge,
  DeleteChallenge
} = require('./app/challenge');
const {
  GetCustomerRewards,
  GetProviderRewards,
  SetReward
} = require('./app/reward');
const {
  CreatePurchase,
  GetCustomerPurchases,
  GetProviderPurchases,
  DeletePurchase
} = require('./app/purchase');

const CustomerSerializer = require('./interfaces/http/customer/CustomerSerializer');
const ProviderSerializer = require('./interfaces/http/provider/ProviderSerializer');
const ProductSerializer = require('./interfaces/http/product/ProductSerializer');
const ChallengeSerializer = require('./interfaces/http/challenge/ChallengeSerializer');

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
const SequelizeChallengesRepository = require('./infra/challenge/SequelizeChallengesRepository');
const SequelizeRewardsRepository = require('./infra/reward/SequelizeRewardsRepository');
const SequelizePurchasesRepository = require('./infra/purchase/SequelizePurchasesRepository');

const { database,
  Customer: CustomerModel,
  Provider: ProviderModel,
  Product: ProductModel,
  Challenge: ChallengeModel,
  Step: StepModel,
  Purchase: PurchaseModel,
  ChallengeCustomer: ChallengeCustomerModel,
  PurchaseStep: PurchaseStepModel,
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
  productsRepository: asClass(SequelizeProductsRepository).singleton(),
  challengesRepository: asClass(SequelizeChallengesRepository).singleton(),
  rewardsRepository: asClass(SequelizeRewardsRepository).singleton(),
  purchasesRepository: asClass(SequelizePurchasesRepository).singleton()
});

// Database
container.register({
  database: asValue(database),
  CustomerModel: asValue(CustomerModel),
  ProviderModel: asValue(ProviderModel),
  ProductModel: asValue(ProductModel),
  ChallengeModel: asValue(ChallengeModel),
  StepModel: asValue(StepModel),
  PurchaseModel: asValue(PurchaseModel),
  ChallengeCustomerModel: asValue(ChallengeCustomerModel),
  PurchaseStepModel: asValue(PurchaseStepModel)
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
  deleteProduct: asClass(DeleteProduct),

  createChallenge: asClass(CreateChallenge),
  getAllChallenges: asClass(GetAllChallenges),
  getProviderChallenges: asClass(GetProviderChallenges),
  getCustomerChallenges: asClass(GetCustomerChallenges),
  getChallenge: asClass(GetChallenge),
  updateChallenge: asClass(UpdateChallenge),
  deleteChallenge: asClass(DeleteChallenge),

  getCustomerRewards: asClass(GetCustomerRewards),
  getProviderRewards: asClass(GetProviderRewards),
  setReward: asClass(SetReward),

  createPurchase: asClass(CreatePurchase),
  getCustomerPurchases: asClass(GetCustomerPurchases),
  getProviderPurchases: asClass(GetProviderPurchases),
  deletePurchase: asClass(DeletePurchase)
});

// Serializers
container.register({
  customerSerializer: asValue(CustomerSerializer),
  providerSerializer: asValue(ProviderSerializer),
  productSerializer: asValue(ProductSerializer),
  challengeSerializer: asValue(ChallengeSerializer)
});

module.exports = container;
