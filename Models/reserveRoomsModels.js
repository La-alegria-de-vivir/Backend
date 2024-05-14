
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
    type : String, 
    required: true 
  },
  slug: {
    type: String,
    unique: true,
}
}, { collection: "reservations" });

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;