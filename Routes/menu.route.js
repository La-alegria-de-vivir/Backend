import express from 'express'
import { verifyToken } from '../Middlewares/verifyUser.js';
import { create, deletemenu, getMenu, updatemenu } from '../Controllers/menu.controllers.js';


const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getmenu', getMenu)
router.delete('/deletemenu/:menuId', deletemenu);
router.put(`/update-menu/:menuId/:userId`, verifyToken, updatemenu);

export default router;
