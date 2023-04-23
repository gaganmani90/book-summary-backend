import express, {Express, Request, Response} from 'express';

import dotenv from 'dotenv';
import {ChatGPTClient} from "./clients/open-ai-client";
import { connectToDatabase } from "./services/database.service"
import {bookRouter} from "./routes/book.router";
import {profileRouter} from "./routes/profile.router";
import {opanAiQueryRouter} from "./routes/openai.query.router";


if(process.env.NODE_ENV != 'prod') dotenv.config();

export const app: Express = express();
app.use(express.json());
const port = process.env.PORT;

app.post('/ask', async (req: Request, res: Response) => {
    const prompt = req.body.prompt;

    try {
        if(prompt == null) {
            res.status(400).json({
                success: false,
                message: "Uh oh, no prompt was provided",
            })
            throw new Error("prompt is empty")
        }
        const response = await ChatGPTClient.Instance.openAiResponse(prompt)
        return res.status(200).json({
            success: true,
            message: response,
        });
    } catch (err) {
        console.log(err)
    }

});

connectToDatabase()
    .then(() => {
        app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            next()
        });
        app.use("/books", bookRouter);
        app.use("/profile", profileRouter);
        app.use("/queries", opanAiQueryRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });