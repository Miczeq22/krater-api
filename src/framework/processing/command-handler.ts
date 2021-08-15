import { Command } from './command';

export abstract class CommandHandler<CommandType extends Command<any>> {
  constructor(public readonly type: string) {}

  public abstract handle(command: CommandType): Promise<any>;
}
