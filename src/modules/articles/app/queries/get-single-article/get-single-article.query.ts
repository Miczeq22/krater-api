import { Query } from '@root/framework/processing/query';

interface Payload {
  id: string;
}

export const GET_SINGLE_ARTICLE_QUERY = 'articles/get-single-article';

export class GetSingleArticleQuery extends Query<Payload> {
  constructor(id: string) {
    super(GET_SINGLE_ARTICLE_QUERY, {
      id,
    });
  }
}
