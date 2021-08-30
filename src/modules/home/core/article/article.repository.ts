import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { Article } from './article.aggregate-root';

export interface ArticleRepository {
  insert(article: Article): Promise<DatabaseTransaction>;

  findById(id: string): Promise<Article | null>;
}
