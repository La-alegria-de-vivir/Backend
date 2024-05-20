import express from 'express';
import { createReservation, deleteReservation, getAllReservations, updateReservationById, closeReservation, getTotalReservations } from '../Controllers/reserveRooms.controller.js';
import { verifyToken } from '../Middlewares/verifyUser.js';
const router = express.Router();

router.post('/create', createReservation);
router.delete('/deletereservations/:reservationId', verifyToken, deleteReservation);
router.get('/getreservations/:id?', getAllReservations);
router.get('/getreservations',verifyToken,  getAllReservations);
router.put('/update-revervations/:reservationId', verifyToken, updateReservationById);
router.put('/update-reservations/:reservationId', verifyToken, updateReservationById);
router.put('/close-reservation/:reservationId', closeReservation);
router.get('/getTotalReservations', verifyToken, getTotalReservations);





export default router;
