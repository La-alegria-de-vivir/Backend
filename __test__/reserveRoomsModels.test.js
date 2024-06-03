import mongoose from "mongoose";
import Reservation from "../models/reserveRoomsModels"; 

describe('Reservation Model', () => {
  
  it('should have a defined schema', () => {
    expect(Reservation.schema).toBeDefined();
  });

  it('should create a new reservation', async () => {
    
    const reservationData = {
      name: 'John Doe',
      date: new Date('2024-06-01'),
      hour: '10:00',
      place: 'Meeting Room',
      people: 5,
      phoneNumber: '123456789',
      slug: 'john-doe-2024-06-01-10-00',
      completed: false,
    };

    const reservation = new Reservation(reservationData);

    expect(reservation.name).toBe(reservationData.name);
    expect(reservation.date).toEqual(reservationData.date);
    expect(reservation.hour).toBe(reservationData.hour);
    expect(reservation.place).toBe(reservationData.place);
    expect(reservation.people).toBe(reservationData.people);
    expect(reservation.phoneNumber).toBe(reservationData.phoneNumber);
    expect(reservation.slug).toBe(reservationData.slug);
    expect(reservation.completed).toBe(reservationData.completed);
  });
});
