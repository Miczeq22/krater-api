import { Command } from '@root/framework/processing/command';

interface Payload {
  email: string;
  password: string;
}

export const LOGIN_COMMAND = 'platform-access/login';

export class LoginCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(LOGIN_COMMAND, payload);
  }
}
