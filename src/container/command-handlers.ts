import { CommandHandler } from '@root/framework/processing/command-handler';
import { ResendConfirmationCodeCommandHandler } from '@root/modules/platform-access/app/commands/resend-confirmation-code/resend-confirmation-code.command-handler';
import { ConfirmEmailAddressCommandHandler } from '@root/modules/platform-access/app/commands/confirm-email-address/confirm-email-address.command-handler';
import { LoginCommandHandler } from '@root/modules/platform-access/app/commands/login/login.command-handler';
import { RegisterNewAccountCommandHandler } from '@root/modules/platform-access/app/commands/register-new-account/register-new-account.command-handler';
import { CreateNewArticleCommandHandler } from '@root/modules/articles/app/commands/create-new-article/create-new-article.command-handler';
import { asClass, AwilixContainer } from 'awilix';
import { registerAsArray } from './register-as-array';

export const registerCommandHandlers = (container: AwilixContainer) => {
  container.register({
    commandHandlers: registerAsArray<CommandHandler<any>>([
      asClass(RegisterNewAccountCommandHandler).singleton(),
      asClass(ConfirmEmailAddressCommandHandler).singleton(),
      asClass(LoginCommandHandler).singleton(),
      asClass(ResendConfirmationCodeCommandHandler).singleton(),
      asClass(CreateNewArticleCommandHandler).singleton(),
    ]),
  });
};
