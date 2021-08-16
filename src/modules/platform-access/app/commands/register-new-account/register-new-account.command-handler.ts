import { CommandHandler } from '@root/framework/processing/command-handler';
import { TransactionalOperation } from '@root/framework/transactional-operation';
import { AccountRegistration } from '@root/modules/platform-access/core/account-registration/account-registration.aggregate-root';
import { AccountRegistrationRepository } from '@root/modules/platform-access/core/account-registration/account-registration.repository';
import { AccountEmailCheckerService } from '@root/modules/shared/core/account-email/account-email-checker.service';
import { PasswordHashProviderService } from '@root/modules/shared/core/account-password/password-hash-provider.service';
import {
  RegisterNewAccountCommand,
  REGISTER_NEW_ACCOUNT_COMMAND,
} from './register-new-account.command';

interface Dependencies {
  accountRegistrationRepository: AccountRegistrationRepository;
  accountEmailCheckerService: AccountEmailCheckerService;
  passwordHashProviderService: PasswordHashProviderService;
  performTransactionalOperation: TransactionalOperation;
}

export class RegisterNewAccountCommandHandler extends CommandHandler<RegisterNewAccountCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(REGISTER_NEW_ACCOUNT_COMMAND);
  }

  public async handle({ payload: { email, password, nickname } }: RegisterNewAccountCommand) {
    const {
      accountRegistrationRepository,
      passwordHashProviderService,
      performTransactionalOperation,
      accountEmailCheckerService,
    } = this.dependencies;

    const account = await AccountRegistration.registerNew({
      email,
      password,
      nickname,
      passwordHashProviderService,
      accountEmailCheckerService,
    });

    await performTransactionalOperation(accountRegistrationRepository.insert.bind(this), account);
  }
}
