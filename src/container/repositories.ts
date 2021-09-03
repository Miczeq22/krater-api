import { ArticleRepositoryImpl } from '@root/modules/articles/infrastructure/article/article.repository';
import { AccountRegistrationRepositoryImpl } from '@root/modules/platform-access/infrastructure/account-registration/account-registration.repository';
import { AccountRepositoryImpl } from '@root/modules/platform-access/infrastructure/account/account.repository';
import { asClass, AwilixContainer } from 'awilix';

export const registerRepositories = (container: AwilixContainer) => {
  container.register({
    accountRegistrationRepository: asClass(AccountRegistrationRepositoryImpl).singleton(),
    accountRepository: asClass(AccountRepositoryImpl).singleton(),
    articleRepository: asClass(ArticleRepositoryImpl).singleton(),
  });
};
