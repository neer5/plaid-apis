import { Request, Response } from 'express';
import { PlaidApi } from 'plaid';
import { createLinkToken, getTransactions } from '../../controller/plaid';
import { transactions } from '../mockdata';

describe('plaid tests', () => {
  describe('createLinkToken() test', () => {
    it('should create link token successfully', async () => {
      PlaidApi.prototype.linkTokenCreate = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              link_token: 'link-sandbox-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx'
            }
          })
        );
      const request = {
        body: {
          clientUserId: 'test'
        }
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();
      await createLinkToken(request, response, next);
      expect(response.status).toBeCalledWith(200);
      expect(response.json).toBeCalledWith({
        data: { link_token: 'link-sandbox-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx' },
        message: 'Link token created successfully'
      });
    });

    it('should return error message', async () => {
      PlaidApi.prototype.linkTokenCreate = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.reject({
            response: { status: 400, statusText: 'Bad Request' }
          })
        );
      const request = {
        body: {
          clientUserId: 'test'
        }
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();
      await createLinkToken(request, response, next);
      expect(response.status).toBeCalledWith(400);
      expect(response.json).toBeCalledWith({ message: 'Bad Request' });
    });
  });

  describe('getTransactions() tests', () => {
    it('should get transactions', async () => {
      PlaidApi.prototype.itemPublicTokenExchange = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({ data: { access_token: 'test_access_token' } })
        );
      PlaidApi.prototype.transactionsSync = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              added: transactions,
              has_more: true,
              next_cursor: 'CAESJTlBemtqxxxxxxxxxxxxxxxxxxxxxxxxx=='
            }
          })
        );
      const request = {
        headers: {
          publictoken: 'test'
        },
        query: {}
      } as unknown as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();
      await getTransactions(request, response, next);
      expect(response.status).toBeCalledWith(200);
      expect(response.json).toBeCalledWith({
        data: transactions,
        hasMore: true,
        cursor: 'CAESJTlBemtqxxxxxxxxxxxxxxxxxxxxxxxxx==',
        message: 'Transactions listed successfully'
      });
    });
    it('should return error in get transactions', async () => {
      PlaidApi.prototype.itemPublicTokenExchange = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.reject({
            response: { status: 400, statusText: 'Something went wrong' }
          })
        );
      PlaidApi.prototype.transactionsSync = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              added: transactions,
              has_more: true,
              next_cursor: 'CAESJTlBemtqxxxxxxxxxxxxxxxxxxxxxxxxx=='
            }
          })
        );
      const request = {
        headers: {
          publictoken: 'test'
        },
        query: { count: 5 }
      } as unknown as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();
      await getTransactions(request, response, next);
      expect(response.status).toBeCalledWith(400);
      expect(response.json).toBeCalledWith({ message: 'Something went wrong' });
    });
  });
});
