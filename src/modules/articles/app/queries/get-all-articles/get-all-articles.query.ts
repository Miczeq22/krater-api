import { Query } from '@root/framework/processing/query';
import { PaginatedRequest } from '@tools/pagination';

export const GET_ALL_ARTICLES_QUERY = 'articles/get-all-articles';

export class GetAllArticlesQuery extends Query<PaginatedRequest> {
  constructor(payload: PaginatedRequest) {
    super(GET_ALL_ARTICLES_QUERY, payload);
  }
}
