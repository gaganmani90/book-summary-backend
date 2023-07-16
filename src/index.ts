import express, {Express} from 'express';

import dotenv from 'dotenv';
import {bootstrap} from "./services/database.service"
import {bookRouter} from "./routes/book.router";
import {profileRouter} from "./routes/profile.router";
import {opanAiQueryRouter} from "./routes/openai.query.router";
import authRoutes from './routes/auth.router';
import passport from './passport';
import cors from 'cors';
// @ts-ignore
import session from 'express-session';
import {askRouter} from "./routes/ask.router";


console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV != 'prod') dotenv.config();

export const app: Express = express();
app.use(express.json());
const port = process.env.PORT;

bootstrap()
    .then(() => {
        app.use(function (req, res, next) {
            cors({
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
                allowedHeaders: ['X-Requested-With', 'content-type', 'Origin', 'Content-Type',
                    'Accept', 'Authorization', 'Access-Control-Allow-Methods','Access-Control-Allow-Origin',
                    'Access-Control-Allow-Headers'],
                credentials: true,
            })

            next()
        });
        // Login
        app.use(session({
            secret: 'your-session-secret-goes-here', // replace with your actual session secret value
            resave: false,
            saveUninitialized: false
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        app.use("/books", cors(), bookRouter);
        app.use("/profile", cors(), profileRouter);
        app.use("/queries", cors(), opanAiQueryRouter);
        app.use('/auth', cors(), authRoutes);
        app.use('/ask', cors, askRouter)

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });