import { Router } from 'express';

import { createLinkToken, getTransactions } from '../controller/plaid';

const router = Router();

router.get('/create-link-token', createLinkToken);
router.get('/transactions', getTransactions);

export default router;
