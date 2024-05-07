import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.Routes.js';
import authRoutes from './routes/auth.Routes.js';
import postRoutes from './routes/post.routes.js'
import commentRoute from './routes/comment.Routes.js'
import cookieParser from 'cookie-parser';



dotenv.config();

mongoose
    .connect(process.env.MONGO).then(
    () =>{
        console.log('Mongodb is connected');
    }).catch((err) =>{
        console.log(err)
    });
    
    
const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () =>{
    console.log('Server is runnig on port 3000');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoute);



app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        sucess: false,
        statusCode,
        message
    })
})