import request from 'supertest';
import express from 'express';
import reserveRoomsRoutes from '../Routes/reserveRoomsRoutes.js';

const app = express();
app.use(express.json());
app.use('/', reserveRoomsRoutes);

describe('Reservation Routes', () => {
  it('should return a 200 status', async () => {
    await request(app)
      .get('/getreservations')
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});