/* eslint-disable import/first */
require('dotenv').config();

import http from 'http';
import { Application } from 'express';
import { Logger } from '@tools/logger';
import { createAppContainer } from './container/app-container';
import { DomainSubscriber } from './framework/ddd-building-blocks/domain-subscriber';

(async () => {
  const container = await createAppContainer();

  const app = container.resolve<Application>('app');
  const logger = container.resolve<Logger>('logger');
  const subscribers = container.resolve<DomainSubscriber<any>[]>('subscribers');

  subscribers.map((subscriber) => subscriber.setup());

  const server = http.createServer(app);

  const port = process.env.PORT;

  server.listen(port, () => {
    logger.info(`🚀 Server is listening on ${process.env.PROTOCOL}://${process.env.HOST}:${port}`);
  });
})();
