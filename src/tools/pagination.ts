import { celebrate, Joi, Segments } from 'celebrate';

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
}

export interface PaginatedRequest {
  start?: number;
  limit?: number;
}

export const DEFAULT_LIMIT = 20;

export const paginatedRequestActionValidation = celebrate({
  [Segments.QUERY]: {
    start: Joi.number(),
    limit: Joi.number(),
  },
});
