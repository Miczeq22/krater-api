import { RequestHandler, Router } from 'express';
import { Controller } from '@root/framework/api/controller';
import { ApiOperationGet, ApiOperationPatch, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { HttpAction } from '@root/framework/api/http-action';
import { paginatedRequestActionValidation } from '@tools/pagination';
import { createNewArticleActionValidation } from './create-new-article/create-new-article.http-action';
import { getSingleArticleActionValidation } from './get-single-article/get-single-article.http-action';
import { updateArticleActionValidation } from './update-article/update-article.http-action';
import { archiveArticleActionValidation } from './archive-article/archive-article.http-action';
import { createNewCommentActionValidation } from './create-new-comment/create-new-comment.http-action';

interface Dependencies {
  authMiddleware: RequestHandler;
  isAccountConfirmedMiddleware: RequestHandler;
  createNewArticleHttpAction: HttpAction;
  getAllArticlesHttpAction: HttpAction;
  getSingleArticleHttpAction: HttpAction;
  updateArticleHttpAction: HttpAction;
  archiveArticleHttpAction: HttpAction;
  createNewCommentHttpAction: HttpAction;
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

  @ApiOperationGet({
    path: '/{id}',
    security: {
      bearerAuth: [],
    },
    parameters: {
      path: {
        id: {
          type: 'string',
          required: true,
          format: 'uuid',
        },
      },
    },
    responses: {
      200: {},
    },
  })
  private getSingleArticle() {
    this.router.get('/:id', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      getSingleArticleActionValidation,
      this.dependencies.getSingleArticleHttpAction.invoke.bind(this),
    ]);
  }

  @ApiOperationPatch({
    path: '/{id}',
    security: {
      bearerAuth: [],
    },
    parameters: {
      path: {
        id: {
          type: 'string',
          required: true,
          format: 'uuid',
        },
      },
      body: {
        properties: {
          title: {
            type: 'string',
            required: false,
          },
          content: {
            type: 'string',
            required: false,
          },
        },
      },
    },
    responses: {
      200: {},
    },
  })
  private updateArticle() {
    this.router.patch('/:id', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      updateArticleActionValidation,
      this.dependencies.updateArticleHttpAction.invoke.bind(this),
    ]);
  }

  @ApiOperationPatch({
    path: '/{id}/archive',
    security: {
      bearerAuth: [],
    },
    parameters: {
      path: {
        id: {
          type: 'string',
          required: true,
          format: 'uuid',
        },
      },
    },
    responses: {
      204: {},
    },
  })
  private archiveArticle() {
    this.router.patch('/:id/archive', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      archiveArticleActionValidation,
      this.dependencies.archiveArticleHttpAction.invoke.bind(this),
    ]);
  }

  @ApiOperationPost({
    path: '/{id}/comments',
    security: {
      bearerAuth: [],
    },
    parameters: {
      path: {
        id: {
          type: 'string',
          required: true,
        },
      },
      body: {
        properties: {
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
  private addComment() {
    this.router.post('/:id/comments', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      createNewCommentActionValidation,
      this.dependencies.createNewCommentHttpAction.invoke.bind(this),
    ]);
  }

  public getRouter() {
    this.createArticle();
    this.getAllArticles();
    this.getSingleArticle();
    this.updateArticle();
    this.archiveArticle();
    this.addComment();

    return this.router;
  }
}
