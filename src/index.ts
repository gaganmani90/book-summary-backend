import express, {Express, Request, Response} from 'express';

import dotenv from 'dotenv';
import {ChatGPTClient} from "./clients/open-ai-client";
import { connectToDatabase } from "./services/database.service"
import {bookRouter} from "./routes/book.router";

dotenv.config();

const app: Express = express();
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
        app.use("/books", bookRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });