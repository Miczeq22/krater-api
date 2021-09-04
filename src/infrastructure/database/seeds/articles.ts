// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import * as Knex from 'knex';
import { v4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  await knex('article').del();
  await knex('account').del().where('email', 'john@gmail.com');

  const authorId = v4();

  await knex('account').insert({
    id: authorId,
    email: 'john@gmail.com',
    password: '$2a$10$zCMrfstUz4HP0XBuk.NXuuPXCLm4DpVIOnjU2Z5.ZAHd93eDGk70u',
    registration_date: new Date().toISOString(),
    email_confirmation_date: new Date().toISOString(),
    status: 'EmailConfirmed',
    nickname: 'johnny',
  });

  await knex('account_activation_code').insert({
    id: v4(),
    code: 'XYZ1',
    account_id: authorId,
    created_at: new Date().toISOString(),
    status: 'Active',
  });

  await knex('article').insert(
    Array.from(Array(100).keys()).map(() => ({
      id: v4(),
      author_id: authorId,
      title: faker.lorem.sentence(Math.round(Math.random() * 5) + 2),
      content: faker.lorem.paragraphs(Math.round(Math.random() * 10) + 1),
      posted_at: faker.date.past().toISOString(),
      status: 'Active',
    })),
  );
}
