import { Router } from 'express';
import { start42OAuth, handle42Callback } from './auth.controller.ts';

const router = Router();

router.get('/42', start42OAuth);
router.get('/42/callback', handle42Callback);
export default router;