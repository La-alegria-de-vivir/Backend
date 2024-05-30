import { signup, signin } from '../Controllers/auth.controllers';
import User from '../Models/user.model';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../Models/user.model'); // Mock el modelo de usuario para evitar llamadas a la base de datos

describe('Auth Controllers', () => {
  describe('signup', () => {
    test('should create a new user', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'testpassword'
        }
      };
      const res = {
        json: jest.fn()
      };
      const next = jest.fn();

      bcryptjs.hashSync = jest.fn().mockReturnValue('hashedPassword');
      const saveMock = jest.fn();
      User.mockReturnValueOnce({
        save: saveMock
      });

      await signup(req, res, next);

      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith('Signup successful');
      expect(next).not.toHaveBeenCalled();
    });

    test('should handle missing fields', async () => {
      const req = {
        body: {
          username: '',
          email: '',
          password: ''
        }
      };
      const next = jest.fn();

      await signup(req, {}, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('signin', () => {
        test('should handle invalid password', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      };
      const next = jest.fn();

      const validUser = {
        password: 'hashedPassword'
      };

      User.findOne.mockResolvedValueOnce(validUser);
      bcryptjs.compareSync = jest.fn().mockReturnValueOnce(false);

      await signin(req, {}, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should handle missing fields', async () => {
      const req = {
        body: {
          email: '',
          password: ''
        }
      };
      const next = jest.fn();

      await signin(req, {}, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
