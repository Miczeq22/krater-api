import { UnauthenticatedError } from '@errors/unauthenticated.error';
import { CommandHandler } from '@root/framework/processing/command-handler';
import { TransactionalOperation } from '@root/framework/transactional-operation';
import { AccountRepository } from '@root/modules/platform-access/core/account/account.repository';
import { TokenProviderService } from '@root/modules/shared/infrastructure/token-provider/token-provider.service';
import {
  ConfirmEmailAddressCommand,
  CONFIRM_EMAIL_ADDRESS_COMMAND,
} from './confirm-email-address.command';

interface Dependencies {
  accountRepository: AccountRepository;
  tokenProviderService: TokenProviderService;
  performTransactionalOperation: TransactionalOperation;
}

export class ConfirmEmailAddressCommandHandler extends CommandHandler<ConfirmEmailAddressCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(CONFIRM_EMAIL_ADDRESS_COMMAND);
  }

  public async handle({ payload: { token } }: ConfirmEmailAddressCommand) {
    const { accountRepository, tokenProviderService, performTransactionalOperation } =
      this.dependencies;

    const { userEmail } = tokenProviderService.verifyAndDecodeToken<{ userEmail: string }>(token);

    const account = await accountRepository.findByEmail(userEmail);

    if (!account) {
      throw new UnauthenticatedError();
    }

    account.confirmEmailAddress();

    await performTransactionalOperation(accountRepository.update.bind(this), account);
  }
}
