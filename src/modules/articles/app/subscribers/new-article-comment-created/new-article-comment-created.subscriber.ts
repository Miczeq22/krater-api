import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { DomainEvents } from '@infrastructure/message-queue/in-memory/in-memory-message-queue.service';
import { DomainSubscriber } from '@root/framework/ddd-building-blocks/domain-subscriber';
import {
  NewArticleCommentCreatedPayload,
  NEW_ARTICLE_COMMENT_CREATED_EVENT,
} from '@root/modules/articles/core/article/events/new-article-comment-created.event';

export class NewArticleCommentCreatedSubscriber extends DomainSubscriber<NewArticleCommentCreatedPayload> {
  constructor() {
    super(NEW_ARTICLE_COMMENT_CREATED_EVENT);
  }

  public setup() {
    DomainEvents.register(this.handle.bind(this), this.name);
  }

  public async handle(
    { articleId, authorId, commentId, content }: NewArticleCommentCreatedPayload,
    trx: DatabaseTransaction,
  ) {
    await trx
      .insert({
        content,
        id: commentId,
        author_id: authorId,
        article_id: articleId,
        posted_at: new Date().toISOString(),
      })
      .into(AvailableDatabaseTable.ARTICLE_COMMENT);
  }
}
