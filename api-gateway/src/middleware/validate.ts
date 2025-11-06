import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

/**
 * Validates incoming request data against a Zod schema or effect.
 * @param schema The Zod schema or effect to validate the request data (required).
 * @returns A middleware function that handles request validation.
 */
const validateRequest =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
