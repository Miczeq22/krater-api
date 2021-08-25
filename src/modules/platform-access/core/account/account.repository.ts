import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { Account } from './account.aggregate-root';

export interface AccountRepository {
  findById(id: string): Promise<Account | null>;

  findByEmail(email: string): Promise<Account | null>;

  update(account: Account): Promise<DatabaseTransaction>;
}
