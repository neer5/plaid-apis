import { RequestHandler, Request, Response } from 'express';
import { Plaid } from '../utils/plaid';
const plaid = new Plaid();

export const createLinkToken: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { clientUserId } = req.body;
  const data = await plaid.createLinkToken({
    clientUserId
  });
  return res
    .status(200)
    .json({ message: 'Link token created successfully', data });
};

export const getTransactions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { publicToken } = req.body;
  const accessToken = await plaid
    .exchangeAccessToken(publicToken)
    .catch((err) => {
      console.log('failed to get access token', err);
      throw new Error(err);
    });
  const transactionData = await plaid
    .getTransactions(accessToken, req.query)
    .catch((err) => {
      console.log('failed to get transacrions', err);
      throw new Error(err);
    });
  const {
    added: data,
    has_more: hasMore,
    next_cursor: cursor
  } = transactionData;
  return res
    .status(200)
    .json({ message: 'Transactions successfully', data, hasMore, cursor });
};
