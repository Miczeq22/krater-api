import { DomainEvent } from './domain-event';
import { Entity } from './entity';

export abstract class AggregateRoot<AggregateProps> extends Entity<AggregateProps> {
  private domainEvents: DomainEvent<any>[] = [];

  protected addDomainEvent(event: DomainEvent<any>) {
    this.domainEvents.push(event);
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
