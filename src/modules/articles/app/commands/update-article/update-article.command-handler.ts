import { UnauthenticatedError } from '@errors/unauthenticated.error';
import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { CommandHandler } from '@root/framework/processing/command-handler';
import { TransactionalOperation } from '@root/framework/transactional-operation';
import { ArticleRepository } from '@root/modules/articles/core/article/article.repository';
import { ArticleDTO } from '@root/modules/articles/dto/article.dto';
import { UpdateArticleCommand, UPDATE_ARTICLE_COMMAND } from './update-article.command';

interface Dependencies {
  articleRepository: ArticleRepository;
  queryBuilder: QueryBuilder;
  performTransactionalOperation: TransactionalOperation;
}

export class UpdateArticleCommandHandler extends CommandHandler<UpdateArticleCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(UPDATE_ARTICLE_COMMAND);
  }

  public async handle({
    payload: { articleId, ...payload },
  }: UpdateArticleCommand): Promise<ArticleDTO> {
    const { articleRepository, queryBuilder, performTransactionalOperation } = this.dependencies;

    const article = await articleRepository.findById(articleId);

    if (!article) {
      throw new UnauthenticatedError(
        `Article with id: "${articleId}" does not exist or you don't have access to update article.`,
      );
    }

    article.updateArticle(payload);

    await performTransactionalOperation(articleRepository.update.bind(this), article);

    const author = await queryBuilder
      .select('nickname')
      .from(AvailableDatabaseTable.ACCOUNT)
      .where('id', payload.userId)
      .first();

    return {
      id: article.getId().getValue(),
      author: author.nickname,
      content: article.getContent(),
      postedAt: article.getPostedAt().toISOString(),
      title: article.getTitle(),
    };
  }
}
