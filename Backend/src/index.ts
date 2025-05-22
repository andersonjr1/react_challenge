import express from 'express';
import config from './config/env';
import router from './routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed request headers
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.listen(config.PORT, (): void => {
  console.log(`Server running on port ${config.PORT}`); // Better message for clarity
});