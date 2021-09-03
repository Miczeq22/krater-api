import { InMemorMailerServiceImpl } from '@infrastructure/mailer/in-memory-mailer.service';
import { RabbitMessageQueueServiceImpl } from '@infrastructure/message-queue/rabbit-mq/rabbit-message-queue.service';
import { ArticlesProviderServiceImpl } from '@root/modules/articles/infrastructure/articles-provider-service/articles-provider.service';
import { NicknameUniqueCheckerServiceImpl } from '@root/modules/platform-access/infrastructure/nickname-unique-checker-service/nickname-unique-checker.service';
import { VerificationCodeProviderServiceImpl } from '@root/modules/platform-access/infrastructure/verification-code-provider-service/verification-code-provider.service';
import { AccountEmailCheckerServiceImpl } from '@root/modules/shared/infrastructure/account-email-checker/account-email-checker.service';
import { PasswordHashProviderServiceImpl } from '@root/modules/shared/infrastructure/password-hash-provider/password-hash-provider.service';
import { JwtTokenProviderServiceImpl } from '@root/modules/shared/infrastructure/token-provider/jwt-token-provider.service';
import { asClass, AwilixContainer } from 'awilix';

export const registerServices = (container: AwilixContainer) => {
  container.register({
    accountEmailCheckerService: asClass(AccountEmailCheckerServiceImpl).singleton(),
    passwordHashProviderService: asClass(PasswordHashProviderServiceImpl).singleton(),
    messageQueueService: asClass(RabbitMessageQueueServiceImpl).singleton(),
    mailerService: asClass(InMemorMailerServiceImpl).singleton(),
    tokenProviderService: asClass(JwtTokenProviderServiceImpl).singleton(),
    nicknameUniqueCheckerService: asClass(NicknameUniqueCheckerServiceImpl).singleton(),
    verificationCodeProviderService: asClass(VerificationCodeProviderServiceImpl).singleton(),
    articlesProviderService: asClass(ArticlesProviderServiceImpl).singleton(),
  });
};
