import { CommandHandler } from '@root/framework/processing/command-handler';
import { TransactionalOperation } from '@root/framework/transactional-operation';
import { Article } from '@root/modules/home/core/article/article.aggregate-root';
import { ArticleRepository } from '@root/modules/home/core/article/article.repository';
import { Logger } from '@tools/logger';
import { CreateNewArticleCommand, CREATE_NEW_ARTICLE_COMMAND } from './create-new-article.command';

interface Dependencies {
  articleRepository: ArticleRepository;
  performTransactionalOperation: TransactionalOperation;
  logger: Logger;
}

export class CreateNewArticleCommandHandler extends CommandHandler<CreateNewArticleCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(CREATE_NEW_ARTICLE_COMMAND);
  }

  public async handle({ payload: { content, title, userId } }: CreateNewArticleCommand) {
    const { articleRepository, performTransactionalOperation, logger } = this.dependencies;

    const article = Article.createNew({
      content,
      title,
      authorId: userId,
    });

    await performTransactionalOperation(articleRepository.insert.bind(this), article);

    logger.info(`User with id: "${userId}" created new article: "${title}"`);
  }
}
