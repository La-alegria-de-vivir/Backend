import { rateLimit } from 'express-rate-limit'

//Declaro una variable para usar luego en mi controllador de auth, y definir el tiempo de expiracion de un token
export const tokenExpirationTime = 3 * 60 * 60 * 1000

//Uso la libreria rateLimit para definir la cantidad de intentos que se pueden hacer en el login
export const limitLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 3, // Max number of entries to try log in
    message: 'Too many fail requests, try in again in 15 minutes',
})