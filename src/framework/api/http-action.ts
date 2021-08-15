import { NextFunction, Request, Response } from 'express';

export interface HttpAction {
  invoke(req: Request, res: Response, next?: NextFunction): Promise<void>;
}
