/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { postgresQueryBuilder } from '@infrastructure/database/query-builder';
import { AggregateRoot } from '@root/framework/ddd-building-blocks/aggregate-root';
import { DomainEventStatusValue } from '@root/framework/ddd-building-blocks/domain-event';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { logger } from '@tools/logger';

export class DomainEvents {
  private static handlersMap = new Map<string, Function[]>();

  private static markedAggregatesMap = new Map<string, AggregateRoot<unknown>>();

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const key = this.getAggregateKey(aggregate);

    if (!this.markedAggregatesMap.has(key)) {
      this.markedAggregatesMap.set(key, aggregate);
    }
  }

  public static async dispatchDomainEventsForAggregate(
    aggregate: AggregateRoot<unknown>,
    trx?: DatabaseTransaction,
  ) {
    const key = this.getAggregateKey(aggregate);

    if (!this.markedAggregatesMap.has(key)) {
      return;
    }

    const eventsToPersist = this.markedAggregatesMap
      .get(key)!
      .getDomainEvents()
      .map((event) => ({
        id: new UniqueEntityID().getValue(),
        event_name: event.name,
        aggregate_root: aggregate.constructor.name,
        aggregate_root_id: aggregate.getId().getValue(),
        occured_on: event.getOccuredOn().toISOString(),
        status: DomainEventStatusValue.Processing,
        payload: JSON.stringify(event.payload),
      }));

    await postgresQueryBuilder().insert(eventsToPersist).into('domain_event');

    const promises = eventsToPersist.map((event) =>
      this.dispatch(event.id, event.event_name, JSON.parse(event.payload), trx),
    );

    aggregate.clearDomainEvents();

    await Promise.all(promises);

    this.markedAggregatesMap.delete(key);
  }

  public static register(
    callback: (payload: any, trx: DatabaseTransaction) => void,
    eventName: string,
  ) {
    if (!this.handlersMap.has(eventName)) {
      this.handlersMap.set(eventName, []);
    }

    this.handlersMap.set(eventName, [...this.handlersMap.get(eventName)!, callback]);
  }

  public static clearHandlers() {
    this.handlersMap.clear();
  }

  public static clearMarkedAggregates() {
    this.markedAggregatesMap.clear();
  }

  private static async dispatch(
    persistedEventId: string,
    eventName: string,
    payload: object,
    trx?: DatabaseTransaction,
  ) {
    if (this.handlersMap.has(eventName)) {
      const handlers = this.handlersMap.get(eventName);

      for (const handler of handlers!) {
        try {
          logger.info(`[Domain Events]: Handling event "${eventName}"`);
          await handler(payload, trx);

          await postgresQueryBuilder()
            .update({
              status: DomainEventStatusValue.Completed,
            })
            .where('id', persistedEventId)
            .into('domain_event');
        } catch (error: any) {
          logger.error(
            `[Domain Events]: Subscriber error occured on event: ${eventName} inside ${handler.name}`,
          );
          logger.error(error.toString());

          await postgresQueryBuilder()
            .update({
              status: DomainEventStatusValue.Failed,
            })
            .where('id', persistedEventId)
            .into('domain_event');

          throw error;
        }
      }
    }
  }

  private static getAggregateKey(aggregate: AggregateRoot<unknown>) {
    return `${aggregate.getId().getValue()}_${aggregate.constructor.name}`;
  }
}
