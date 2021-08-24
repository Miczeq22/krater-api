import { Command } from '@root/framework/processing/command';

interface Payload {
  userId: string;
  activationCode: string;
}

export const CONFIRM_EMAIL_ADDRESS_COMMAND = 'platform-access/confirm-email-address';

export class ConfirmEmailAddressCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(CONFIRM_EMAIL_ADDRESS_COMMAND, payload);
  }
}
