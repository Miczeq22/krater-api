import rascal from 'rascal';
import definitions from '@infrastructure/message-queue/rabbit-mq/rabbitmq-config.json';
import { Server } from '@api/server';
import { CommandBus } from '@root/framework/processing/command-bus';
import { performTransactionalOperation } from '@root/framework/transactional-operation';
import { logger } from '@tools/logger';
import { asClass, asFunction, asValue, AwilixContainer, createContainer } from 'awilix';
import { postgresQueryBuilder } from '@infrastructure/database/query-builder';
import { registerControllers } from './controllers';

export const createAppContainer = async (): Promise<AwilixContainer> => {
  const config = rascal.withDefaultConfig(definitions);
  const rascalBroker = await rascal.BrokerAsPromised.create(config);

  const container = createContainer();

  container.register({
    logger: asValue(logger),
    commandBus: asClass(CommandBus).singleton(),
    queryBuilder: asValue(postgresQueryBuilder()),
    rascalBroker: asValue(rascalBroker),
    performTransactionalOperation: asFunction(performTransactionalOperation).scoped(),
  });

  registerControllers(container);

  container.register({
    server: asClass(Server).singleton(),
  });

  const app = container.resolve<Server>('server').getApp();

  container.register({
    app: asValue(app),
  });

  return container;
};
