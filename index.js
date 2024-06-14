import express from "express";
import dotenv from 'dotenv';
import userRoutes from './Routes/user.route.js';
import authRoutes from './Routes/auth.Routes.js';
import menuRoutes from './Routes/menu.route.js';
import reserveRoutes from './Routes/reserveRoomsRoutes.js';
import cookieParser from "cookie-parser";
import cors from 'cors';
import db from "./Database/db.js";

dotenv.config();

db();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use("/api/reserve", reserveRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
