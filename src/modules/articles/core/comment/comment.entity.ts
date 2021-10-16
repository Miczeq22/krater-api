import { Entity } from '@root/framework/ddd-building-blocks/entity';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { CreateNewCommentDTO } from '../../dto/create-new-comment.dto';

interface CommentProps {
  authorId: UniqueEntityID;
}

export interface PersistedComment {
  id: string;
  authorId: string;
}

export class Comment extends Entity<CommentProps> {
  private constructor(props: CommentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew({ authorId }: Pick<CreateNewCommentDTO, 'authorId'>) {
    return new Comment({ authorId: new UniqueEntityID(authorId) });
  }

  public static fromPersistence({ authorId, id }: PersistedComment) {
    return new Comment(
      {
        authorId: new UniqueEntityID(authorId),
      },
      new UniqueEntityID(id),
    );
  }
}
