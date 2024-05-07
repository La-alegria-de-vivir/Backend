import express from 'express';
import { createReservation, deleteReservation, getReservationById, getAllReservations, updateReservationById } from '../Controllers/reserveRooms.controller.js';
const router = express.Router();

router.post('/', createReservation);
router.delete('/:id', deleteReservation);
router.get('/:id', getReservationById);
router.get('/', getAllReservations);
router.put('/:id' , updateReservationById);

export default router;
