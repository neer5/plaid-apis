import { RequestHandler, Request, Response } from 'express';
import { Plaid } from '../utils/plaid';
const plaid = new Plaid();

export const createLinkToken: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const params = {
    clientUserId: 'user-id'
  };
  const data = await plaid.createLinkToken(params);
  return res
    .status(200)
    .json({ message: 'Link token created successfully', data });
};

export const getTransactions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { publicToken } = req.body;
  const accessToken = await plaid.exchangeAccessToken(publicToken);
  const data = await plaid.getTransactions(accessToken);
  return res
    .status(200)
    .json({ message: 'Transactions successfully', data });
};
