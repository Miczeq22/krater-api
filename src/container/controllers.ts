import { Controller } from '@root/framework/api/controller';
import * as Awilix from 'awilix';
import { registerAsArray } from './register-as-array';

export const registerControllers = (container: Awilix.AwilixContainer) => {
  container.register({
    controllers: registerAsArray<Controller>([]),
  });
};
