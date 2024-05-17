// import Reservation from '../Models/reserveRoomsModels.js';

// // Controlador para crear una reserva
// export const createReservation = async (req, res) => {
//   const { name, date, hour, place, people, phoneNumber } = req.body;

//   try {
//     // Verificar si se supera el límite de comensales
//     const maxNumberOfPeople = place === 'Sala' ? 28 : 24; // Límite de comensales por zona
//     if (people > maxNumberOfPeople) {
//       return res.status(400).json({ message: `Se ha superado el número máximo de comensales en ${place}` });
//     }

//     // Verificar si se supera el límite total de reservas
//       const totalReservations = await Reservation.countDocuments();
//     if (totalReservations >= 100) {
//       return res.status(400).json({ message: 'Se ha superado el número máximo de reservas en la web. Por favor, contacte con el restaurante.' });
//     }

//     // Si no se supera el límite, crea la reserva
//     const newReservation = new Reservation({
//       name,
//       date,
//       hour,
//       place,
//       people,
//       phoneNumber
//     });
//     await newReservation.save();
//     res.status(201).json(newReservation);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Hubo un error al crear la reserva" });
//   }
// };

// // Controlador para eliminar una reserva
// export const deleteReservation = async (req, res, next) => {
//   try {
//     const { reservationId } = req.params; 
//     const deletedReservation = await Reservation.findByIdAndDelete(reservationId); 
    
//     if (!deletedReservation) {
//       return next(errorHandler(404, "Reserva no encontrada"));
//     }
    
//     res.status(200).json({ message: "Reserva eliminada exitosamente", deletedReservation });
//   } catch (error) {
//     next(error);
//   }
// };



// // Controlador para ver una reserva por su ID
// export const getReservationById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const reservation = await Reservation.findById(id);
//     if (!reservation) {
//       return res.status(404).json({ message: "Reserva no encontrada" });
//     }
//     res.json(reservation);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Controlador para ver todas las reservas
// export const getAllReservations = async (req, res) => {
//   try {
//     const reservations = await Reservation.find();
//     res.json(reservations);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Controlador para actualizar una reserva por su ID


// export const updateReservationById = async (req, res) => {
//   const { reservationsId } = req.params; 
//   const { name, date, hour, place, people, phoneNumber } = req.body;

//   try {
//     // Verificar si la reserva existe
//     const existingReservation = await Reservation.findById(reservationsId); 
//     if (!existingReservation) {
//       return res.status(404).json({ message: "La reserva no existe" });
//     }

//     // Verificar si se supera el límite de comensales
//     const maxNumberOfPeople = place === 'Sala' ? 28 : 24; 
//     if (people > maxNumberOfPeople) {
//       return res.status(400).json({ message: `Se ha superado el número máximo de comensales en ${place}` });
//     }

//     // Actualizar la reserva
//     existingReservation.name = name;
//     existingReservation.date = date;
//     existingReservation.hour = hour;
//     existingReservation.place = place;
//     existingReservation.people = people;
//     existingReservation.phoneNumber = phoneNumber;
//     const updatedReservation = await existingReservation.save();

//     // Responder con la reserva actualizada
//     res.status(200).json({ message: "Reserva actualizada exitosamente", updatedReservation });
//   } catch (error) {
//     res.status(500).json({ message: "Hubo un error al actualizar la reserva", error });
//   }
// };


import Reservation from '../Models/reserveRoomsModels.js';

// Controlador para crear una reserva
export const createReservation = async (req, res) => {
  const { name, date, hour, place, people, phoneNumber } = req.body;

  try {
    // Verificar si se supera el límite de comensales por zona
    const maxNumberOfPeople = place === 'Sala' ? 28 : 24; // Límite de comensales por zona
    if (people > maxNumberOfPeople) {
      return res.status(400).json({ message: `Se ha superado el número máximo de comensales en ${place}` });
    }

    // Calcular la suma total de comensales en un período de dos horas
    const twoHourInterval = 2; // Intervalo de dos horas
    const reservationsInTwoHours = await Reservation.find({
      date: date,
      hour: { $gte: hour, $lte: hour + twoHourInterval }
    });
    const totalPeopleInTwoHours = reservationsInTwoHours.reduce((total, reservation) => total + reservation.people, 0);

    // Verificar si se supera el límite total de comensales en el período de dos horas
    const totalCapacity = 28; // Capacidad total en dos horas
    if (totalPeopleInTwoHours + people > totalCapacity) {
      // Bloquear las dos horas siguientes
      const blockedHours = await Reservation.find({
        date: date,
        hour: { $gte: hour + 1, $lte: hour + twoHourInterval }
      });
      const blockedHoursIds = blockedHours.map(reservation => reservation._id);

      // Actualizar las reservas bloqueadas
      await Reservation.updateMany(
        { _id: { $in: blockedHoursIds } },
        { $set: { blocked: true } }
      );

      return res.status(400).json({ message: 'Se ha superado el número máximo de comensales en este período de dos horas. Las reservas en las próximas dos horas han sido bloqueadas.' });
    }

    // Si no se supera el límite, crea la reserva
    const newReservation = new Reservation({
      name,
      date,
      hour,
      place,
      people,
      phoneNumber,
      blocked: false
    });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al crear la reserva" });
  }
};

// Controlador para eliminar una reserva
export const deleteReservation = async (req, res, next) => {
  try {
    const { reservationId } = req.params; 
    const deletedReservation = await Reservation.findByIdAndDelete(reservationId); 
    
    if (!deletedReservation) {
      return next(errorHandler(404, "Reserva no encontrada"));
    }
    
    res.status(200).json({ message: "Reserva eliminada exitosamente", deletedReservation });
  } catch (error) {
    next(error);
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
  const { reservationsId } = req.params; 
  const { name, date, hour, place, people, phoneNumber } = req.body;

  try {
    // Verificar si la reserva existe
    const existingReservation = await Reservation.findById(reservationsId); 
    if (!existingReservation) {
      return res.status(404).json({ message: "La reserva no existe" });
    }

    // Verificar si se supera el límite de comensales por zona
    const maxNumberOfPeople = place === 'Sala' ? 28 : 24; 
    if (people > maxNumberOfPeople) {
      return res.status(400).json({ message: `Se ha superado el número máximo de comensales en ${place}` });
    }

    // Calcular la suma total de comensales en un período de dos horas
    const twoHourInterval = 2; // Intervalo de dos horas
    const reservationsInTwoHours = await Reservation.find({
      date: date,
      hour: { $gte: hour, $lte: hour + twoHourInterval },
      _id: { $ne: reservationsId } // Excluir la reserva actual
    });
    const totalPeopleInTwoHours = reservationsInTwoHours.reduce((total, reservation) => total + reservation.people, 0);

    // Verificar si se supera el límite total de comensales en el período de dos horas
    const totalCapacity = 28; // Capacidad total en dos horas
    if (totalPeopleInTwoHours + people > totalCapacity) {
      // Bloquear las dos horas siguientes
      const blockedHours = await Reservation.find({
        date: date,
        hour: { $gte: hour + 1, $lte: hour + twoHourInterval }
      });
      const blockedHoursIds = blockedHours.map(reservation => reservation._id);

      // Actualizar las reservas bloqueadas
      await Reservation.updateMany(
        { _id: { $in: blockedHoursIds } },
        { $set: { blocked: true } }
      );

      return res.status(400).json({ message: 'Se ha superado el número máximo de comensales en este período de dos horas. Las reservas en las próximas dos horas han sido bloqueadas.' });
    }

    // Actualizar la reserva
    existingReservation.name = name;
    existingReservation.date = date;
    existingReservation.hour = hour;
    existingReservation.place = place;
    existingReservation.people = people;
    existingReservation.phoneNumber = phoneNumber;
    const updatedReservation = await existingReservation.save();

    // Responder con la reserva actualizada
    res.status(200).json({ message: "Reserva actualizada exitosamente", updatedReservation });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al actualizar la reserva", error });
  }
};