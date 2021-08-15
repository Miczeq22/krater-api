import { QueryHandler } from './query-handler';
import { Query } from './query';
import { QueryHandlerNotFoundError } from './query-handler-not-found.error';

interface Dependencies {
  queryHandlers: QueryHandler<any, any>[];
}

export class QueryBus {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(query: Query<any>) {
    const { queryHandlers } = this.dependencies;

    const queryHandler = queryHandlers.find(
      (existingQueryHandler) => existingQueryHandler.type === query.type,
    );

    if (!queryHandler) {
      throw new QueryHandlerNotFoundError(query.type);
    }

    return queryHandler.handle(query);
  }
}
