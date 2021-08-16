import { AccountRegistrationRepositoryImpl } from '@root/modules/platform-access/infrastructure/account-registration/account-registration.repository';
import { asClass, AwilixContainer } from 'awilix';

export const registerRepositories = (container: AwilixContainer) => {
  container.register({
    accountRegistrationRepository: asClass(AccountRegistrationRepositoryImpl).singleton(),
  });
};
