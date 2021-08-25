import { UnauthorizedError } from '@errors/unauthorized.error';
import { CommandHandler } from '@root/framework/processing/command-handler';
import { AccountRepository } from '@root/modules/platform-access/core/account/account.repository';
import { TokenProviderService } from '@root/modules/shared/infrastructure/token-provider/token-provider.service';
import { LoginCommand, LOGIN_COMMAND } from './login.command';

interface Dependencies {
  accountRepository: AccountRepository;
  tokenProviderService: TokenProviderService;
}

export class LoginCommandHandler extends CommandHandler<LoginCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(LOGIN_COMMAND);
  }

  public async handle({ payload: { email, password } }: LoginCommand) {
    const { accountRepository, tokenProviderService } = this.dependencies;

    const account = await accountRepository.findByEmail(email);

    if (!account) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    await account.login(password);

    return tokenProviderService.generateToken({
      userId: account.getId().getValue(),
    });
  }
}
