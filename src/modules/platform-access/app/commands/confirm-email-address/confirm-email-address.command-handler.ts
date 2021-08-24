import { UnauthenticatedError } from '@errors/unauthenticated.error';
import { CommandHandler } from '@root/framework/processing/command-handler';
import { TransactionalOperation } from '@root/framework/transactional-operation';
import { AccountRepository } from '@root/modules/platform-access/core/account/account.repository';
import {
  ConfirmEmailAddressCommand,
  CONFIRM_EMAIL_ADDRESS_COMMAND,
} from './confirm-email-address.command';

interface Dependencies {
  accountRepository: AccountRepository;
  performTransactionalOperation: TransactionalOperation;
}

export class ConfirmEmailAddressCommandHandler extends CommandHandler<ConfirmEmailAddressCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(CONFIRM_EMAIL_ADDRESS_COMMAND);
  }

  public async handle({ payload: { activationCode, userId } }: ConfirmEmailAddressCommand) {
    const { accountRepository, performTransactionalOperation } = this.dependencies;

    const account = await accountRepository.findById(userId);

    if (!account) {
      throw new UnauthenticatedError();
    }

    account.confirmEmailAddress(activationCode);

    await performTransactionalOperation(accountRepository.update.bind(this), account);
  }
}
