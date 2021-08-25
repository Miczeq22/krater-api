import { QueryHandler } from '@root/framework/processing/query-handler';
import { GetAccountDataQueryHandler } from '@root/modules/platform-access/app/queries/get-account-data/get-account-data.query-handler';
import { asClass, AwilixContainer } from 'awilix';
import { registerAsArray } from './register-as-array';

export const registerQueryHandlers = (container: AwilixContainer) => {
  container.register({
    queryHandlers: registerAsArray<QueryHandler<any, any>>([
      asClass(GetAccountDataQueryHandler).singleton(),
    ]),
  });
};
