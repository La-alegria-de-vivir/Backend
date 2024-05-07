//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Usuario
//   room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }, // Sala

import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  user: { type: String, require: false }, // Cambia el tipo a String si solo necesitas el nombre de usuario
  date: { type: Date, required: true },
  duration: {type : Number, required: true },
  hour: { type: String, required: true }, // Cambia el tipo a String si solo necesitas la hora
  room: { type: String, required: true } // Cambia el tipo a String si solo necesitas el nombre de la sala
}, { collection: "reservations" });

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;

