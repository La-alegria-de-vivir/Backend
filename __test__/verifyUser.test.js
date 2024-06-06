// __tests__/verifyToken.test.js
import jwt from 'jsonwebtoken';
import { verifyToken } from '../Middlewares/verifyUser.js';
import { errorHandler } from '../Middlewares/error.js';
import { publicKey } from '../Config/keypair.js';

jest.mock('jsonwebtoken');
jest.mock('../Middlewares/error.js');

describe('verifyToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next with an error if no token is present', () => {
    req.cookies.access_token = undefined;
    errorHandler.mockReturnValue(new Error('Unauthorized'));

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('Unauthorized'));
  });

  it('should call next with an error if token verification fails', () => {
    req.cookies.access_token = 'invalid_token';
    jwt.verify.mockImplementation((token, key, callback) => {
      callback(new Error('Unauthorized'), null);
    });
    errorHandler.mockReturnValue(new Error('Unauthorized'));

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('Unauthorized'));
  });

  it('should set req.user and call next if token is valid', () => {
    const userData = { id: 1, name: 'Test User' };
    req.cookies.access_token = 'valid_token';
    jwt.verify.mockReturnValue(userData);

    verifyToken(req, res, next);

    expect(req.user).toEqual(userData);
    expect(next).toHaveBeenCalled();
  });
});
