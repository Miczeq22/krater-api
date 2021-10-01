import { Command } from '@root/framework/processing/command';
import { ArchiveArticleDTO } from '@root/modules/articles/dto/archive-article.dto';

export const ARCHIVE_ARTICLE_COMMAND = 'platforms/archive-article';

export class ArchiveArticleCommand extends Command<ArchiveArticleDTO> {
  constructor(payload: ArchiveArticleDTO) {
    super(ARCHIVE_ARTICLE_COMMAND, payload);
  }
}
