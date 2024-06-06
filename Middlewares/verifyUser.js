import jwt from 'jsonwebtoken';
import { publicKey } from '../Config/keypair.js';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  try {
    const verified = jwt.verify(token, publicKey);
    req.user = verified;
    next();
  } catch (error) {
    return next(errorHandler(401, 'Unauthorized'));
  }
};
