import { Command } from '@root/framework/processing/command';

interface Payload {
  token: string;
}

export const CONFIRM_EMAIL_ADDRESS_COMMAND = 'platform-access/confirm-email-address';

export class ConfirmEmailAddressCommand extends Command<Payload> {
  constructor(token: string) {
    super(CONFIRM_EMAIL_ADDRESS_COMMAND, { token });
  }
}
