import express, {Express, Request, Response} from 'express';

import dotenv from 'dotenv';
import {ChatGPTClient} from "./clients/open-ai-client";
import {MongoDbClient} from "./clients/mongo-db-client";

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT;


app.post('/ask', async (req: Request, res: Response) => {
    const prompt = req.body.prompt;
    MongoDbClient.Instance.bookSummaryCollection() //TODO: this is just for testing the db connection
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

app.listen(port, () => {
    console.log(`⚡️[server]: Server Gagan is running at http://localhost:${port}`);
    // console.log(openAiResponse.toString())
});