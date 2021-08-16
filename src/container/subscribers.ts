import { DomainSubscriber } from '@root/framework/ddd-building-blocks/domain-subscriber';
import { NewAccontRegisteredSubscriber } from '@root/modules/platform-access/app/subscribers/new-account-registered/new-account-registered.subscriber';
import { asClass, AwilixContainer } from 'awilix';
import { registerAsArray } from './register-as-array';

export const registerSubscribers = (container: AwilixContainer) => {
  container.register({
    subscribers: registerAsArray<DomainSubscriber<any>>([
      asClass(NewAccontRegisteredSubscriber).singleton(),
    ]),
  });
};
