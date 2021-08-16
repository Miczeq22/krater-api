import rascal from 'rascal';
import definitions from '@infrastructure/message-queue/rabbit-mq/rabbitmq-config.json';
import { Server } from '@api/server';
import { CommandBus } from '@root/framework/processing/command-bus';
import { performTransactionalOperation } from '@root/framework/transactional-operation';
import { logger } from '@tools/logger';
import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
  InjectionMode,
  Lifetime,
} from 'awilix';
import { postgresQueryBuilder } from '@infrastructure/database/query-builder';
import { registerControllers } from './controllers';
import { registerServices } from './services';
import { registerRepositories } from './repositories';
import { registerCommandHandlers } from './command-handlers';
import { registerSubscribers } from './subscribers';

export const createAppContainer = async (): Promise<AwilixContainer> => {
  const config = rascal.withDefaultConfig(definitions);
  const rascalBroker = await rascal.BrokerAsPromised.create(config);

  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({
    logger: asValue(logger),
    commandBus: asClass(CommandBus).singleton(),
    queryBuilder: asValue(postgresQueryBuilder()),
    rascalBroker: asValue(rascalBroker),
    performTransactionalOperation: asFunction(performTransactionalOperation).scoped(),
  });

  container.loadModules(['src/**/**/**/**/**/*.http-action.ts'], {
    formatName: 'camelCase',
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
      register: asClass,
    },
  });

  registerSubscribers(container);

  registerCommandHandlers(container);

  registerControllers(container);

  registerServices(container);

  registerRepositories(container);

  container.register({
    server: asClass(Server).singleton(),
  });

  const app = container.resolve<Server>('server').getApp();

  container.register({
    app: asValue(app),
  });

  return container;
};
