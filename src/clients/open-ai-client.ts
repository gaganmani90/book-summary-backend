import {OpenAIApi} from "openai";
import {LocalCache} from "../cache/LocalCache";

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
                                maxToken = 10): Promise<string> {
        let cache = LocalCache.Instance
        if (cache.get(prompt)) {
            return cache.get(prompt)
        }
        console.log("making service call...")
        const response = await this.openAi.createCompletion({
            model: model,
            prompt: prompt,
            max_tokens: maxToken,
            temperature: 0,
        })
        const value: string | undefined = response.data.choices[0].text == undefined ? "" : response.data.choices[0].text
        cache.set(prompt, value)
        return value;
    }
}
