import { DomainEvent } from '@root/framework/ddd-building-blocks/domain-event';

export interface NewArticleCommentCreatedPayload {
  commentId: string;
  content: string;
  authorId: string;
  articleId: string;
}

export const NEW_ARTICLE_COMMENT_CREATED_EVENT = 'articles/new-article-comment-created';

export class NewArticleCommentCreatedEvent extends DomainEvent<NewArticleCommentCreatedPayload> {
  constructor(payload: NewArticleCommentCreatedPayload) {
    super(NEW_ARTICLE_COMMENT_CREATED_EVENT, payload);
  }
}
