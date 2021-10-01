import { UnauthenticatedError } from '@errors/unauthenticated.error';
import { CommandHandler } from '@root/framework/processing/command-handler';
import { TransactionalOperation } from '@root/framework/transactional-operation';
import { ArticleRepository } from '@root/modules/articles/core/article/article.repository';
import { ArchiveArticleCommand, ARCHIVE_ARTICLE_COMMAND } from './archive-article.command';

interface Dependencies {
  articleRepository: ArticleRepository;
  performTransactionalOperation: TransactionalOperation;
}

export class ArchiveArticleCommandHandler extends CommandHandler<ArchiveArticleCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(ARCHIVE_ARTICLE_COMMAND);
  }

  public async handle({ payload: { articleId, userId } }: ArchiveArticleCommand) {
    const { articleRepository, performTransactionalOperation } = this.dependencies;

    const article = await articleRepository.findById(articleId);

    if (!article) {
      throw new UnauthenticatedError(
        `Article with id: "${articleId}" does not exist or you don't have access to update article.`,
      );
    }

    article.archive({ userId });

    await performTransactionalOperation(articleRepository.update.bind(this), article);
  }
}
