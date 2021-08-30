import { DatabaseTransaction } from '@infrastructure/database/database-transaction';

export abstract class DomainSubscriber<PayloadType extends object> {
  constructor(public readonly name: string) {}

  public abstract setup(): void;

  public abstract handle(payload: PayloadType, trx: DatabaseTransaction): Promise<void>;
}
