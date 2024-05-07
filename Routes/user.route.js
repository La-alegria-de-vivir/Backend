import express from 'express'
import { verifyToken } from '../Middlewares/verifyUser.js';
import { deleteUser, getUser, getUsers, signout, updateUser } from '../Controllers/user.controllers.js';
const router = express.Router();

router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);

export default router;