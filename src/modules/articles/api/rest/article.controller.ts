import { RequestHandler, Router } from 'express';
import { Controller } from '@root/framework/api/controller';
import { ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { HttpAction } from '@root/framework/api/http-action';
import { createNewArticleActionValidation } from './create-new-article/create-new-article.http-action';

interface Dependencies {
  authMiddleware: RequestHandler;
  isAccountConfirmedMiddleware: RequestHandler;
  createNewArticleHttpAction: HttpAction;
}

@ApiPath({
  name: 'Article',
  path: '/article',
})
export class ArticleController extends Controller {
  private readonly router = Router();

  constructor(private readonly dependencies: Dependencies) {
    super('/article');
  }

  @ApiOperationPost({
    path: '',
    security: {
      bearerAuth: [],
    },
    parameters: {
      body: {
        properties: {
          title: {
            type: 'string',
            required: true,
          },
          content: {
            type: 'string',
            required: true,
          },
        },
      },
    },
    responses: {
      200: {},
    },
  })
  private createArticle() {
    this.router.post('/', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      createNewArticleActionValidation,
      this.dependencies.createNewArticleHttpAction.invoke.bind(this),
    ]);
  }

  public getRouter() {
    this.createArticle();

    return this.router;
  }
}
