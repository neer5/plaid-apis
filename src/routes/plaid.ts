import { Router } from 'express';

import { createLinkToken } from '../controller/plaid';

const router = Router();

router.get('/create-link-token', createLinkToken);

export default router;
