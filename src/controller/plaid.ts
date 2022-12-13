import { RequestHandler, Request, Response } from 'express';
import { Plaid } from '../utils/plaid';
const plaid = new Plaid();

export const createLinkToken: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { clientUserId } = req.body;
  try {
    const data = await plaid.createLinkToken({
      clientUserId
    });
    return res
      .status(200)
      .json({ message: 'Link token created successfully', data });
  } catch (error: any) {
    return res
      .status(error?.response?.status || 500)
      .json({ message: error?.response?.statusText || 'Something went wrong' });
  }
};

export const getTransactions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { publictoken } = req.headers;
  try {
    const accessToken = await plaid.exchangeAccessToken(publictoken as string);
    const transactionData = await plaid.getTransactions(accessToken, req.query);
    const {
      added: data,
      has_more: hasMore,
      next_cursor: cursor
    } = transactionData;
    return res
      .status(200)
      .json({
        message: 'Transactions listed successfully',
        data,
        hasMore,
        cursor
      });
  } catch (error: any) {
    return res
      .status(error?.response?.status || 500)
      .json({ message: error?.response?.statusText || 'Something went wrong' });
  }
};
