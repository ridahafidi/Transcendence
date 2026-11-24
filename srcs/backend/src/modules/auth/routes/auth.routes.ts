import { Router } from 'express';
import { start42OAuth, handle42Callback } from '@/modules/auth/controllers/auth.controller';
import { authenticate } from '@/modules/auth/middlewares/authenticate';
import { refreshAccessToken, logout } from '@/modules/auth/controllers/session.controller';
import { register } from '@/modules/auth/controllers/registration.controller';
import { login } from '@/modules/auth/controllers/login.controller';
import { getMe } from '@/modules/auth/controllers/current-user.controller';
import { validateRequest } from '@/modules/auth/middlewares/validate-request';
import { registerSchema } from '@/modules/auth/schemas/register.schema';
import { loginSchema } from '@/modules/auth/schemas/login.schema';


const router = Router();

router.get('/42', start42OAuth);
router.get('/42/callback', handle42Callback);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', authenticate, getMe);

export default router;