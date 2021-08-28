import { DomainEvents } from '@infrastructure/message-queue/in-memory/in-memory-message-queue.service';
import { DomainEvent } from './domain-event';
import { Entity } from './entity';

export abstract class AggregateRoot<AggregateProps> extends Entity<AggregateProps> {
  private domainEvents: DomainEvent<any>[] = [];

  protected addDomainEvent(event: DomainEvent<any>) {
    this.domainEvents.push(event);

    DomainEvents.markAggregateForDispatch(this);
  }

  public getDomainEvents() {
    return [...this.domainEvents];
  }

  public clearDomainEvents() {
    this.domainEvents = [];
  }

  public getAggregateName() {
    return AggregateRoot.name;
  }
}
