// 

import Reservation from '../Models/reserveRoomsModels.js';

// Controlador para crear una reserva
export const createReservation = async (req, res) => {
  const { name, date, hour, place, people, phoneNumber } = req.body;

  try {
    // Verificar si se supera el límite de comensales
    const maxNumberOfPeople = place === 'Sala' ? 28 : 24; // Límite de comensales por zona
    if (people > maxNumberOfPeople) {
      return res.status(400).json({ message: `Se ha superado el número máximo de comensales en ${place}` });
    }

    // Verificar si se supera el límite total de reservas
    // Coloca tu lógica para verificar el límite total aquí
    const totalReservations = await Reservation.countDocuments();
    if (totalReservations >= 100) {
      return res.status(400).json({ message: 'Se ha superado el número máximo de reservas en la web. Por favor, contacte con el restaurante.' });
    }

    // Si no se supera el límite, crea la reserva
    const newReservation = new Reservation({
      name,
      date,
      hour,
      place,
      people,
      phoneNumber
    });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al crear la reserva" });
  }
};

// Controlador para eliminar una reserva
export const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(id);
    if (!deletedReservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.json({ message: "Reserva eliminada exitosamente", deletedReservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para ver una reserva por su ID
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para ver todas las reservas
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para actualizar una reserva por su ID
export const updateReservationById = async (req, res) => {
  const { id } = req.params;
  const { name, date, hour, place, people, phoneNumber } = req.body;

  try {
    // Verificar si se supera el límite de comensales
    const maxNumberOfPeople = place === 'Sala' ? 28 : 24; // Límite de comensales por zona
    if (people > maxNumberOfPeople) {
      return res.status(400).json({ message: `Se ha superado el número máximo de comensales en ${place}` });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(id, {
      name,
      date,
      hour,
      place,
      people,
      phoneNumber
    }, { new: true });

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.status(200).json({ message: "Reserva actualizada exitosamente", updatedReservation });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al actualizar la reserva", error });
  }
};