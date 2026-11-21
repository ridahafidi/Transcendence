import { Router } from 'express';
import { logout, start42OAuth, handle42Callback, refreshAccessToken } from '../controllers/auth.controller.ts';

const router = Router();

router.get('/42', start42OAuth);
router.get('/42/callback', handle42Callback);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
export default router;