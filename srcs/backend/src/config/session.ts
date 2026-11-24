import session from 'express-session';
import 'dotenv/config';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not defined in the environment variables.');
}

const isProduction = process.env.NODE_ENV === 'production';

export const sessionMiddleware = session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax'
    }
});