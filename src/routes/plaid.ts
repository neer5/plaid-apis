import { Router } from 'express';
import {
  createLinkTokenValidator,
  getTransactionsValidator
} from '../utils/validator';
import { createLinkToken, getTransactions } from '../controller/plaid';

const router = Router();

router.post('/create-link-token', createLinkTokenValidator, createLinkToken);
router.get('/transactions', getTransactionsValidator, getTransactions);

export default router;
