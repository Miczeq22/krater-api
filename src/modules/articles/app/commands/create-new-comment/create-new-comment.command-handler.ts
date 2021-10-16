import { NotFoundError } from '@errors/not-found.error';
import { CommandHandler } from '@root/framework/processing/command-handler';
import { TransactionalOperation } from '@root/framework/transactional-operation';
import { ArticleRepository } from '@root/modules/articles/core/article/article.repository';
import { Logger } from '@tools/logger';
import { CreateNewCommentCommand, CREATE_NEW_COMMENT_COMMAND } from './create-new-comment.command';

interface Dependencies {
  articleRepository: ArticleRepository;
  performTransactionalOperation: TransactionalOperation;
  logger: Logger;
}

export class CreateNewCommentCommandHandler extends CommandHandler<CreateNewCommentCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(CREATE_NEW_COMMENT_COMMAND);
  }

  public async handle({ payload: { articleId, authorId, content } }: CreateNewCommentCommand) {
    const { articleRepository, logger, performTransactionalOperation } = this.dependencies;

    const article = await articleRepository.findById(articleId);

    if (!article) {
      throw new NotFoundError(`Article with id: "${articleId}" does not exist.`);
    }

    const comment = article.addComment({
      authorId,
      content,
    });

    await performTransactionalOperation(articleRepository.update.bind(this), article);

    logger.info(
      `User with id: "${authorId}" created new comment: "${content.slice(100)}${
        content.length > 100 ? '...' : ''
      }" for article with id: "${articleId}"`,
    );

    return comment;
  }
}
