import { Query } from '@root/framework/processing/query';

interface Payload {
  userId: string;
}

export const GET_ACCOUNT_DATA_QUERY = 'platform-access/get-account-data';

export class GetAccountDataQuery extends Query<Payload> {
  constructor(userId: string) {
    super(GET_ACCOUNT_DATA_QUERY, { userId });
  }
}
