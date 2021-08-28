import { UnauthorizedError } from '@errors/unauthorized.error';
import { CommandHandler } from '@root/framework/processing/command-handler';
import { TransactionalOperation } from '@root/framework/transactional-operation';
import { AccountRepository } from '@root/modules/platform-access/core/account/account.repository';
import {
  ResendConfirmationCodeCommand,
  RESEND_CONFIRMATION_CODE_COMMAND,
} from './resend-confirmation-code.command';

interface Dependencies {
  accountRepository: AccountRepository;
  performTransactionalOperation: TransactionalOperation;
}

export class ResendConfirmationCodeCommandHandler extends CommandHandler<ResendConfirmationCodeCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(RESEND_CONFIRMATION_CODE_COMMAND);
  }

  public async handle({ payload: { userId } }: ResendConfirmationCodeCommand) {
    const { accountRepository, performTransactionalOperation } = this.dependencies;

    const account = await accountRepository.findById(userId);

    if (!account) {
      throw new UnauthorizedError();
    }

    account.resendConfirmationCode();

    await performTransactionalOperation(accountRepository.update.bind(this), account);
  }
}
