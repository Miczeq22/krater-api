export enum DomainEventStatusValue {
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
}

export abstract class DomainEvent<PayloadType extends object> {
  private occuredOn: Date;

  constructor(public readonly name: string, public readonly payload: PayloadType) {
    this.occuredOn = new Date();
  }

  public getOccuredOn() {
    return this.occuredOn;
  }
}
