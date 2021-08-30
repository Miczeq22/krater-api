import { Controller } from '@root/framework/api/controller';
import { ArticleController } from '@root/modules/home/api/rest/article.controller';
import { PlatformAccessController } from '@root/modules/platform-access/api/rest/platform-access.controller';
import * as Awilix from 'awilix';
import { asClass } from 'awilix';
import { registerAsArray } from './register-as-array';

export const registerControllers = (container: Awilix.AwilixContainer) => {
  container.register({
    controllers: registerAsArray<Controller>([
      asClass(PlatformAccessController).singleton(),
      asClass(ArticleController).singleton(),
    ]),
  });
};
