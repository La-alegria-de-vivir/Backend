import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { test, getUser } from '../Controllers/user.controllers.js';
import User from '../Models/user.model.js';

// Mock del modelo User
jest.mock('../Models/user.model.js');

const app = express();
app.use(express.json());

// Rutas para pruebas
app.get('/test', test);
app.get('/users/:userId', getUser);

describe('User Controller', () => {
  // Prueba para el endpoint test
  describe('GET /test', () => {
    it('should return a message', async () => {
      const res = await request(app).get('/test');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'API is working!' });
    });
  });

  // Prueba para el endpoint getUser
  describe('GET /users/:userId', () => {
    it('should return a user without password', async () => {
      const mockUser = {
        _id: '60d21b8667d0d8992e610c85',
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'hashedpassword',
        _doc: {
          _id: '60d21b8667d0d8992e610c85',
          username: 'testuser',
          email: 'testuser@example.com',
        },
      };
      
      User.findById.mockResolvedValue(mockUser);

      const res = await request(app).get('/users/60d21b8667d0d8992e610c85');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        _id: '60d21b8667d0d8992e610c85',
        username: 'testuser',
        email: 'testuser@example.com',
      });
    });
  });
});

// Desconectar de mongoose después de todas las pruebas
afterAll(async () => {
  await mongoose.disconnect();
});
