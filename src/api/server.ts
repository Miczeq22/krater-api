import path from 'path';
import * as swagger from 'swagger-express-ts';
import { Controller } from '@root/framework/api/controller';
import { Logger } from '@tools/logger';
import { swaggerExpressOptions } from '@tools/swagger';
import { NotFoundError } from '@errors/not-found.error';
import express, { Application } from 'express';
import corsMiddleware from './middlewares/cors/cors.middleware';
import { applySecurityMiddleware } from './middlewares/security/security.middleware';
import { errorHandlerMiddleware } from './middlewares/error-handler/error-handler.middleware';

interface Dependencies {
  controllers: Controller[];
  logger: Logger;
}

export class Server {
  private readonly app: Application;

  constructor(private readonly dependencies: Dependencies) {
    this.app = express();

    this.initMiddlewares();

    this.initRoutes();
  }

  private initMiddlewares() {
    this.app.use(corsMiddleware);

    applySecurityMiddleware(this.app);

    this.app.use(express.json());
  }

  private initRoutes() {
    this.app.use('/api-docs', express.static(path.join(__dirname, '..', '..', 'swagger')));

    this.app.use(
      '/api-docs/swagger/assets',
      express.static(path.join(__dirname, '..', '..', 'node_modules', 'swagger-ui-dist')),
    );

    this.app.use(swagger.express(swaggerExpressOptions));

    this.dependencies.controllers.forEach((controller) =>
      this.app.use(controller.route, controller.getRouter()),
    );

    this.app.use('*', (req, __, next) =>
      next(new NotFoundError(`Route "${req.originalUrl}" does not exist.`)),
    );

    this.app.use(errorHandlerMiddleware(this.dependencies.logger));
  }

  public getApp() {
    return this.app;
  }
}
