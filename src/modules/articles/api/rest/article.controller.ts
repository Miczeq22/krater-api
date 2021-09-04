import { RequestHandler, Router } from 'express';
import { Controller } from '@root/framework/api/controller';
import { ApiOperationGet, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { HttpAction } from '@root/framework/api/http-action';
import { paginatedRequestActionValidation } from '@tools/pagination';
import { createNewArticleActionValidation } from './create-new-article/create-new-article.http-action';

interface Dependencies {
  authMiddleware: RequestHandler;
  isAccountConfirmedMiddleware: RequestHandler;
  createNewArticleHttpAction: HttpAction;
  getAllArticlesHttpAction: HttpAction;
}

@ApiPath({
  name: 'Articles',
  path: '/articles',
})
export class ArticleController extends Controller {
  private readonly router = Router();

  constructor(private readonly dependencies: Dependencies) {
    super('/articles');
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

  @ApiOperationGet({
    path: '',
    security: {
      bearerAuth: [],
    },
    parameters: {
      query: {
        start: {
          type: 'number',
          required: false,
        },
        limit: {
          type: 'number',
          required: false,
        },
      },
    },
    responses: {
      200: {},
    },
  })
  private getAllArticles() {
    this.router.get('/', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      paginatedRequestActionValidation,
      this.dependencies.getAllArticlesHttpAction.invoke.bind(this),
    ]);
  }

  public getRouter() {
    this.createArticle();
    this.getAllArticles();

    return this.router;
  }
}
