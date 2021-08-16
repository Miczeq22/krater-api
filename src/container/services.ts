import { RabbitMessageQueueServiceImpl } from '@infrastructure/message-queue/rabbit-mq/rabbit-message-queue.service';
import { AccountEmailCheckerServiceImpl } from '@root/modules/shared/infrastructure/account-email-checker/account-email-checker.service';
import { PasswordHashProviderServiceImpl } from '@root/modules/shared/infrastructure/password-hash-provider/password-hash-provider.service';
import { asClass, AwilixContainer } from 'awilix';

export const registerServices = (container: AwilixContainer) => {
  container.register({
    accountEmailCheckerService: asClass(AccountEmailCheckerServiceImpl).singleton(),
    passwordHashProviderService: asClass(PasswordHashProviderServiceImpl).singleton(),
    messageQueueService: asClass(RabbitMessageQueueServiceImpl).singleton(),
  });
};
