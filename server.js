import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import notesRoutes from './routes/root.js'
import userRoutes from './routes/userRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import connectDb from './config/dbConn.js';
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import {logger, logEvents} from './middleware/logger.js'
import  errorHandler  from './middleware/errorHandler.js';
const app = express();
const PORT = process.env.PORT || 3000;

connectDb();

app.use(logger)
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(express.static('public'))
//* OR
app.use('/', express.static(path.join(__dirname, 'public')))


app.use('/', notesRoutes)
app.use('/users', userRoutes)
app.use('/notes', noteRoutes)

app.all('*',(req,res) => {
        res.status(404)
        if (req.accepts('html')) {
                res.sendFile(path.join(__dirname, 'views', '404.html'))
        }else if(req.accepts('json')) {
                res.json({message: "404 Not Found"})
        }else{
                res.type('txt').send("404 Not Found")
        }
})

app.use(errorHandler)

// this will be called once the connection is established
mongoose.connection.once('open', () => {
        console.log("Connected to db")
        app.listen(PORT, () => {
                console.log(`Port running at ${PORT}`);
        })
})

// this will be called every time 
mongoose.connection.on('error', (err) => {
        console.log(err);
        logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog.log');
});