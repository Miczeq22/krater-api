/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { AggregateRoot } from '@root/framework/ddd-building-blocks/aggregate-root';
import { DomainEvent } from '@root/framework/ddd-building-blocks/domain-event';
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

    const promises = this.markedAggregatesMap
      .get(key)!
      .getDomainEvents()
      .map((event) => this.dispatch(event, trx));

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

  private static async dispatch(event: DomainEvent<any>, trx?: DatabaseTransaction) {
    if (this.handlersMap.has(event.name)) {
      const handlers = this.handlersMap.get(event.name);

      for (const handler of handlers!) {
        try {
          await handler(event.payload, trx);
        } catch (error) {
          logger.error(`Subscriber error occured on event: ${event.name} inside ${handler.name}`);
          logger.error(error.toString());
        }
      }
    }
  }

  private static getAggregateKey(aggregate: AggregateRoot<unknown>) {
    return `${aggregate.getId().getValue()}_${aggregate.constructor.name}`;
  }
}
