import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const createLinkTokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // create schema object
  const schema = Joi.object({
    clientUserId: Joi.string().required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((x) => x.message).join(', ') });
  } else {
    next();
  }
};
export const getTransactionsValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // create schema object
  const schema = Joi.object({
    publictoken: Joi.string().required()
  });
  const { error } = schema.validate(req.headers);

  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((x) => x.message).join(', ') });
  } else {
    next();
  }
};
