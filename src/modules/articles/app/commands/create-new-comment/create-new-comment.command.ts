import { Command } from '@root/framework/processing/command';
import { CreateNewCommentDTO } from '@root/modules/articles/dto/create-new-comment.dto';

export const CREATE_NEW_COMMENT_COMMAND = 'articles/create-new-comment';

export class CreateNewCommentCommand extends Command<CreateNewCommentDTO> {
  constructor(payload: CreateNewCommentDTO) {
    super(CREATE_NEW_COMMENT_COMMAND, payload);
  }
}
