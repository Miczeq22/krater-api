export abstract class DomainSubscriber<PayloadType extends object> {
  constructor(public readonly name: string) {}

  public abstract handle(payload: PayloadType): Promise<void>;
}
