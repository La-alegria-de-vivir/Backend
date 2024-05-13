// //   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Usuario
// //   room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }, // Sala

// import mongoose from "mongoose";

// const reservationSchema = new mongoose.Schema({
//   name: { 
//     type: String,
//      require: true 
//     }, // Cambia el tipo a String si solo necesitas el nombre de usuario
//   date: { 
//     type: Date, 
//     required: true 
//   },
//   hour: {
//     type : String, 
//     required: true 
//   },
//   place: { 
//     type: String, 
//     required: true 
//   }, // Cambia el tipo a String si solo necesitas la hora
//   people: { 
//     type: Number, 
//     required: true 
//   }, // Cambia el tipo a String si solo necesitas el nombre de la sala
//   telefnumber: {
//     type : Number, 
//     required: true 
//   }

// }, { collection: "reservations" });

// const Reservation = mongoose.model('Reservation', reservationSchema);

// export default Reservation;



import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  hour: {
    type : String, 
    required: true 
  },
  place: { 
    type: String, 
    required: true 
  },
  people: { 
    type: Number, 
    required: true 
  },
  phoneNumber: {
    type : String, // Cambiado a String para permitir formatos de teléfono más flexibles
    required: true 
  }
}, { collection: "reservations" });

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;