import express from 'express';
import { signin, signup } from '../Controllers/auth.controllers.js';
import { limitLogin } from '../Middlewares/timeout.js';


const router = express.Router();

router.post('/signup', signup);
router.post('/signin', limitLogin ,signin);

export default router;