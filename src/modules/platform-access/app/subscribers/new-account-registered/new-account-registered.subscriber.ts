import { DomainSubscriber } from '@root/framework/ddd-building-blocks/domain-subscriber';
import {
  NewAccountRegisteredEventPayload,
  NEW_ACCOUNT_REGISTERED_EVENT,
} from '@root/modules/platform-access/core/account-registration/events/new-account-registered.event';
import { Logger } from '@tools/logger';

interface Dependencies {
  logger: Logger;
}

export class NewAccontRegisteredSubscriber extends DomainSubscriber<NewAccountRegisteredEventPayload> {
  constructor(private readonly dependencies: Dependencies) {
    super(NEW_ACCOUNT_REGISTERED_EVENT);
  }

  public async handle() {
    const { logger } = this.dependencies;

    logger.info('Implement sending email with activation link.');
  }
}
