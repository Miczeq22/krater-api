import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { MessageQueueService } from '@infrastructure/message-queue/message-queue.service';
import { AggregateRoot } from './ddd-building-blocks/aggregate-root';

interface Dependencies {
  messageQueueService: MessageQueueService;
}

export const performTransactionalOperation =
  ({ messageQueueService }: Dependencies) =>
  async <AggregateRootType extends AggregateRoot<unknown>>(
    operation: (aggregate: AggregateRootType) => Promise<DatabaseTransaction>,
    aggregate: AggregateRootType,
  ) => {
    const trx = await operation(aggregate);

    try {
      const events = aggregate.getDomainEvents();
      const promises = events.map((event) =>
        messageQueueService.produceMessage(event.name, event.payload),
      );

      await Promise.all(promises);

      await trx.commit();
    } catch (error) {
      await trx.rollback();

      throw error;
    }
  };

export type TransactionalOperation = <AggregateRootType extends AggregateRoot<unknown>>(
  operation: (aggregate: AggregateRootType) => Promise<DatabaseTransaction>,
  aggregate: AggregateRootType,
) => Promise<void>;
