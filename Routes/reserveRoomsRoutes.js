import express from 'express';
import { createReservation, deleteReservation, getReservationById, getAllReservations, updateReservationById } from '../Controllers/reserveRooms.controller.js';
import { verifyToken } from '../Middlewares/verifyUser.js';
const router = express.Router();

router.post('/create', createReservation);
router.delete('/deletereservations/:reservetId/:userId', verifyToken, deleteReservation);
router.get('/getreservations/:id',verifyToken,  getReservationById);
router.get('/getreservations',verifyToken,  getAllReservations);
router.put('/updaterevervations/:id' ,verifyToken,  updateReservationById);

export default router;
