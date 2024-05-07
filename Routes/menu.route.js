import express from 'express'
import { verifyToken } from '../Middlewares/verifyUser.js';
import { create, deletemenu, getMenu, updatemenu } from '../Controllers/menu.controllers.js';


const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getpost', getMenu)
router.delete('/deletepost/:postId/:userId', verifyToken, deletemenu);
router.put(`/updatepost/:postId/:userId`, verifyToken, updatemenu);

export default router;
