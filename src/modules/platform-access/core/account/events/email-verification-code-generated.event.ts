import { DomainEvent } from '@root/framework/ddd-building-blocks/domain-event';

interface Payload {
  accountId: string;
  activationCode: string;
  generatedAt: string;
}

export const EMAIL_VERIFICATION_CODE_GENERATED_EVENT =
  'platform-access/email-verification-code-generated';

export class EmailVerificationCodeGeneratedEvent extends DomainEvent<Payload> {
  constructor(payload: Payload) {
    super(EMAIL_VERIFICATION_CODE_GENERATED_EVENT, payload);
  }
}
