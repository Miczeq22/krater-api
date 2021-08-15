import { Query } from './query';

export abstract class QueryHandler<QueryType extends Query<any>, ResultType extends object> {
  constructor(public readonly type: string) {}

  public abstract handle(query: QueryType): Promise<ResultType>;
}
