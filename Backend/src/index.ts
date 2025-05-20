import express from 'express';
import config from './config/env';
import router from './routes';
import cookieParser from 'cookie-parser';

const app = express()

app.use(express.json());

app.use(cookieParser());

app.use("/api", router)
app.listen(config.PORT, (): void => {console.log("Funcionando")})