import { rateLimit } from 'express-rate-limit'

export const tokenExpirationTime = 3 * 60 * 60 * 1000

export const limitLogin = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 3, 
    message: 'Too many fail requests, try in again in 15 minutes',
})