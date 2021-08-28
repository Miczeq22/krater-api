import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { DomainEvents } from '@infrastructure/message-queue/in-memory/in-memory-message-queue.service';
import { AggregateRoot } from './ddd-building-blocks/aggregate-root';

interface Dependencies {}

export const performTransactionalOperation =
  ({}: Dependencies) =>
  async <AggregateRootType extends AggregateRoot<unknown>>(
    operation: (aggregate: AggregateRootType) => Promise<DatabaseTransaction>,
    aggregate: AggregateRootType,
  ) => {
    const trx = await operation(aggregate);

    try {
      await DomainEvents.dispatchDomainEventsForAggregate(aggregate, trx);

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
