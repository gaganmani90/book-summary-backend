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

    public async openAiResponseWithTurbo(prompt: string,
                                model = "gpt-3.5-turbo",
                                maxToken = 1024): Promise<string> {
        var value: string = ""
        try {
            const cacheResponse = await RedisClient.get(prompt)
            if (cacheResponse) {
                console.log("cache hit...")
                return cacheResponse
            }
            console.log(`chatGPT service call to mode: ${model}`)
            const response = await this.openAi.createChatCompletion({
                model: model,
                messages: [
                    {
                        "role": "system",
                        "content": "You will be provided with statements, and your task is to provide book recommendations. " +
                            "Limit your responses within 20 words. Format answers in markdown."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens: maxToken,
                temperature: 0,
            })
            // @ts-ignore
            value = JSON.stringify(response.data.choices[0].message.content)
            RedisClient.set(prompt, JSON.stringify(response.data))
        } catch(err) {
            console.error("error during chat GPT api call")
            console.error(err)
        }
        return value;
    }

    /**
     * @deprecated since a turbo version is released, this is deprecated
     * @param prompt
     * @param model
     * @param maxToken
     */
    public async openAiResponseLegacy(prompt: string,
                                      model = "text-davinci-003",
                                      maxToken = 1024): Promise<string> {
        var value: string = ""
        try {
            const cacheResponse = await RedisClient.get(prompt)
            if (cacheResponse) {
                console.log("cache hit...")
                return cacheResponse
            }
            console.log(`chatGPT service call to mode: ${model}`)
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

