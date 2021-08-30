import { Command } from '@root/framework/processing/command';

interface Payload {
  userId: string;
  title: string;
  content: string;
}

export const CREATE_NEW_ARTICLE_COMMAND = 'home/create-new-article';

export class CreateNewArticleCommand extends Command<Payload> {
  constructor(payload: Payload) {
    super(CREATE_NEW_ARTICLE_COMMAND, payload);
  }
}
