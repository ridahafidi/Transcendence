import { Router } from 'express';
import {getMe, login, register, logout, start42OAuth, handle42Callback, refreshAccessToken } from '../controllers/auth.controller.ts';
import { authenticate } from '../middlewares/authenticate.ts';

const router = Router();

router.get('/42', start42OAuth);
router.get('/42/callback', handle42Callback);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
export default router;