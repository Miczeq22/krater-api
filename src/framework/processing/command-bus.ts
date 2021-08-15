import { Command } from './command';
import { CommandHandler } from './command-handler';
import { CommandHandlerNotFoundError } from './command-handler-not-found.error';

interface Dependencies {
  commandHandlers: CommandHandler<any>[];
}

export class CommandBus {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: Command<any>) {
    const commandHandler = this.dependencies.commandHandlers.find(
      (existingCommandHandler) => existingCommandHandler.type === command.type,
    );

    if (!commandHandler) {
      throw new CommandHandlerNotFoundError(command.type);
    }

    return commandHandler.handle(command);
  }
}
