/* eslint-disable import/first */
require('dotenv').config();

import http from 'http';
import { Application } from 'express';
import { Logger } from '@tools/logger';
import { MessageQueueService } from '@infrastructure/message-queue/message-queue.service';
import { createAppContainer } from './container/app-container';
import { DomainSubscriber } from './framework/ddd-building-blocks/domain-subscriber';

(async () => {
  const container = await createAppContainer();

  const app = container.resolve<Application>('app');
  const logger = container.resolve<Logger>('logger');
  const subscribers = container.resolve<DomainSubscriber<any>[]>('subscribers');
  const messageQueueService = container.resolve<MessageQueueService>('messageQueueService');

  await Promise.all(
    subscribers.map((subscriber) => messageQueueService.consumeMessage(subscriber.name)),
  );

  const server = http.createServer(app);

  const port = process.env.PORT;

  server.listen(port, () => {
    logger.info(`🚀 Server is listening on ${process.env.PROTOCOL}://${process.env.HOST}:${port}`);
  });
})();
