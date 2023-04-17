import express, {Express, Request, Response} from 'express';

import dotenv from 'dotenv';
import {ChatGPTClient} from "./openai/open-ai-client";

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

app.listen(port, () => {
    console.log(`⚡️[server]: Server Gagan is running at http://localhost:${port}`);
    // console.log(openAiResponse.toString())
});