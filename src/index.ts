/* eslint-disable import/first */
require('dotenv').config();

import http from 'http';
import { Logger } from '@tools/logger';
import { Application } from 'express';
import { createAppContainer } from './container/app-container';

(async () => {
  const container = await createAppContainer();

  const app = container.resolve<Application>('app');
  const logger = container.resolve<Logger>('logger');

  const server = http.createServer(app);

  const port = process.env.PORT;

  server.listen(port, () => {
    logger.info(`🚀 Server is listening on ${process.env.PROTOCOL}://${process.env.HOST}:${port}`);
  });
})();
