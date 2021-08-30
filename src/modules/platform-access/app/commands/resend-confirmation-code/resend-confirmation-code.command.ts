import { Command } from '@root/framework/processing/command';

interface Payload {
  userId: string;
}

export const RESEND_CONFIRMATION_CODE_COMMAND = 'platform-access/resend-confirmation-code';

export class ResendConfirmationCodeCommand extends Command<Payload> {
  constructor(userId: string) {
    super(RESEND_CONFIRMATION_CODE_COMMAND, { userId });
  }
}
