import { Command } from '@root/framework/processing/command';
import { UpdateArticleDTO } from '@root/modules/articles/dto/update-article.dto';

export const UPDATE_ARTICLE_COMMAND = 'articles/update-article';

export class UpdateArticleCommand extends Command<UpdateArticleDTO> {
  constructor(payload: UpdateArticleDTO) {
    super(UPDATE_ARTICLE_COMMAND, payload);
  }
}
