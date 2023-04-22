import {OpenAIApi} from "openai";
import RedisClient from "../cache/redis-client";

export class ChatGPTClient {
    private openAi: OpenAIApi
    private static _instance: ChatGPTClient

    public static get Instance() {
        return this._instance || (this._instance = new ChatGPTClient())
    }

    constructor() {
        console.log("creating new ChatGPTClient instance")
        const {Configuration, OpenAIApi} = require("openai");
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openAi = new OpenAIApi(configuration);
    }

    public async openAiResponse(prompt: string,
                                model = "text-davinci-003",
                                maxToken = 1024): Promise<string> {
        var value: string = ""
        try {
            const cacheResponse = await RedisClient.get(prompt)
            if (cacheResponse) {
                console.log("cache hit...")
                return cacheResponse
            }
            console.log("chatGPT service call...")
            const response = await this.openAi.createCompletion({
                model: model,
                prompt: prompt,
                max_tokens: maxToken,
                temperature: 0,
            })
            value = response.data.choices[0].text == undefined ? "" : response.data.choices[0].text
            RedisClient.set(prompt, value)
        } catch(err) {
            console.error("error during chat GPT api call")
            console.error(err)
        }
        return value;
    }
}

