import { DomainEvent } from '@root/framework/ddd-building-blocks/domain-event';

interface Payload {
  userId: string;
}

export const USER_LOGGED_IN_EVENT = 'platform_access.user_logged_in';

export class UserLoggedInEvent extends DomainEvent<Payload> {
  constructor(payload: Payload) {
    super(USER_LOGGED_IN_EVENT, payload);
  }
}
