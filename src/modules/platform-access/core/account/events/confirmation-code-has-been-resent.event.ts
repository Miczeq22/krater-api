import { DomainEvent } from '@root/framework/ddd-building-blocks/domain-event';

export interface ConfirmationCodeHasBeenResentEventPayload {
  accountEmail: string;
  activationCode: string;
}

export const CONFIRMATION_CODE_HAS_BEEN_RESENT_EVENT =
  'platform_access.confirmation_code_has_been_resent';

export class ConfirmationCodeHasBeenResentEvent extends DomainEvent<ConfirmationCodeHasBeenResentEventPayload> {
  constructor(payload: ConfirmationCodeHasBeenResentEventPayload) {
    super(CONFIRMATION_CODE_HAS_BEEN_RESENT_EVENT, payload);
  }
}
