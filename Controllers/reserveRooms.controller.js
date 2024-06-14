import Reservation from '../Models/reserveRoomsModels.js';
import slugify from 'slugify';


export const createReservation = async (req, res) => {
  const { name, date, hour, place, people, phoneNumber } = req.body;

  try {
  
    const reservationDate = new Date(date);

    
    if (!name || !date || !hour || !place || !people || !phoneNumber) {
      return res.status(400).json({ message: 'Faltan datos obligatorios para crear la reserva.' });
    }

   
    const sameTimeDayReservations = await Reservation.find({
      date: reservationDate,
      hour: hour,
      place: place
    });

    let totalPeople = sameTimeDayReservations.reduce((total, reservation) => total + reservation.people, 0);

   
    const maxPeopleInSala = 28;
    const maxPeopleInTerraza = 24;

    if ((place === 'Sala' && totalPeople + people > maxPeopleInSala) || (place === 'Terraza' && totalPeople + people > maxPeopleInTerraza)) {
      const maxPeople = place === 'Sala' ? maxPeopleInSala : maxPeopleInTerraza;
      console.log(`Total de personas para el día ${date}, hora ${hour} en la ${place}: ${totalPeople}`);
      return res.status(400).json({ message: `Se ha alcanzado el límite de ${maxPeople} comensales permitidos para esta hora en la ${place}. No se puede realizar la reserva.` });
    } else {
      // Crear un slug único para la reserva
      let uniqueSlug = slugify(name + '-' + reservationDate.getTime(), { lower: true });
      while (await Reservation.findOne({ slug: uniqueSlug })) {
        uniqueSlug = slugify(name + '-' + reservationDate.getTime() + '-' + Math.random().toString(36).substring(7), { lower: true });
      }

      const newReservation = new Reservation({
        name,
        date: reservationDate,
        hour,
        place,
        people,
        phoneNumber,
        slug: uniqueSlug
      });

      await newReservation.save();

      console.log(`Total de personas para el día ${date}, hora ${hour} en la ${place}: ${totalPeople + people}`);

      return res.status(201).json({ message: 'Reserva creada exitosamente.', reservation: newReservation });
    }
  } catch (error) {
    console.error('Error al crear reserva:', error);
    return res.status(500).json({ message: 'Error al crear reserva. Por favor, inténtalo de nuevo.' });
  }
};




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



export const getAllReservations = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
     
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Reserva no encontrada" });
      }
      return res.json(reservation);
    } else {
     
      const reservations = await Reservation.find();
      return res.json(reservations);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateReservationById = async (req, res) => {
  const { reservationId } = req.params;
  const { name, date, hour, place, people, phoneNumber } = req.body;

  try {
    // Verificar si la reserva existe
    const existingReservation = await Reservation.findById(reservationId);
    if (!existingReservation) {
      return res.status(404).json({ message: "La reserva no existe" });
    }

    // Verificar si se supera el límite de comensales por zona
    const maxNumberOfPeople = place === 'sala' ? 28 : 24;
    if (people > maxNumberOfPeople) {
      return res.status(400).json({ message: `Se ha superado el número máximo de comensales en ${place}` });
    }

    // Calcular la suma total de comensales en un período de dos horas
    const twoHourInterval = 2; // Intervalo de dos horas
    const reservationsInTwoHours = await Reservation.find({
      date: new Date(date),
      hour: { $gte: hour, $lt: hour + twoHourInterval },
      _id: { $ne: reservationId } // Excluir la reserva actual
    });
    const totalPeopleInTwoHours = reservationsInTwoHours.reduce((total, reservation) => total + reservation.people, 0);

    // Verificar si se supera el límite total de comensales en el período de dos horas
    const totalCapacity = 28; // Capacidad total en dos horas
    if (totalPeopleInTwoHours + people > totalCapacity) {
      // Bloquear las dos horas siguientes
      const blockedHours = await Reservation.find({
        date: new Date(date),
        hour: { $gte: hour + 1, $lt: hour + twoHourInterval }
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
    existingReservation.date = new Date(date);
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


export const closeReservation = async (req, res, next) => {
  try {
    const { reservationId } = req.params;
    
    console.log(`Intentando cerrar la reserva con ID: ${reservationId}`);

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { completed: true },
      { new: true }
    );

    if (!updatedReservation) {
      console.log(`Reserva con ID ${reservationId} no encontrada`);
      return next(errorHandler(404, "Reserva no encontrada"));
    }

    console.log(`Reserva con ID ${reservationId} marcada como cerrada`);

    res.status(200).json({ message: "La reserva ha sido marcada como cerrada.", updatedReservation });
  } catch (error) {
    console.error(`Error al cerrar la reserva con ID ${reservationId}:`, error);
    next(error);
  }
};

const getTotalReservations = async (req, res) => {
  try {
    const { startIndex, limit, name, date } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1); 
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const totalReservations = await Reservation.countDocuments(query);
    const reservations = await Reservation.find(query).skip(parseInt(startIndex)).limit(parseInt(limit));
    res.status(200).json({ totalReservations, reservations });
  } catch (error) {
    console.error("Error fetching total reservations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getTotalReservations };


