import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
 
dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
 
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
})
 