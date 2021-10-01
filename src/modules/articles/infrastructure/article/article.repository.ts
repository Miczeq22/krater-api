import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { Article } from '../../core/article/article.aggregate-root';
import { ArticleRepository } from '../../core/article/article.repository';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class ArticleRepositoryImpl implements ArticleRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(article: Article) {
    const trx = await this.dependencies.queryBuilder.transaction();

    await trx.insert(article.toPersistence()).into(AvailableDatabaseTable.ARTICLE);

    return trx;
  }

  public async findById(id: string) {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select(['id', 'author_id', 'title', 'content', 'posted_at', 'status'])
      .where('id', id)
      .from(AvailableDatabaseTable.ARTICLE)
      .first();

    if (!result) {
      return null;
    }

    return Article.fromPersistence(result);
  }

  public async update(article: Article) {
    const trx = await this.dependencies.queryBuilder.transaction();

    await trx
      .update({
        title: article.getTitle(),
        content: article.getContent(),
        status: article.getStatus(),
      })
      .where('id', article.getId().getValue())
      .into(AvailableDatabaseTable.ARTICLE);

    return trx;
  }
}
