import { createReservation, deleteReservation } from '../Controllers/reserveRooms.controller.js';
import Reservation from '../Models/reserveRoomsModels.js';
import errorHandler from '../Middlewares/error';


jest.mock('../Models/reserveRoomsModels');

// Tests para el controlador 'create'
describe('createReservation', () => {
    test('should create a new reservation', async () => {
      const req = {
        body: {
          name: 'Test Reservation',
          date: '2023-06-04',
          hour: 12,
          place: 'Sala',
          people: 10,
          phoneNumber: '1234567890'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

     });

    test('should handle missing fields', async () => {
      const req = {
        body: {
          name: '',
          date: '',
          hour: '',
          place: '',
          people: '',
          phoneNumber: ''
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Faltan datos obligatorios para crear la reserva.' });
    });
});

// Tests para el controlador 'deletereserve'
describe('deleteReservation', () => {
    test('should delete a reservation', async () => {
      const req = {
        params: {
          reservationId: 'testId'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();
  
      const mockReservation = {
        _id: 'testId',
        name: 'Test Reservation',
        date: new Date('2023-06-04'),
        hour: 12,
        place: 'Sala',
        people: 10,
        phoneNumber: '1234567890'
      };
  
      Reservation.findByIdAndDelete.mockResolvedValue(mockReservation);
  
      await deleteReservation(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Reserva eliminada exitosamente',
        deletedReservation: mockReservation
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    test('should handle reservation not found', async () => {
      const req = {
        params: {
          reservationId: 'testId'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();
  
      Reservation.findByIdAndDelete.mockResolvedValue(null);
  
      await deleteReservation(req, res, next);
  
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });;

