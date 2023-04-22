// External Dependencies
import express, {Request, response, Response} from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Profile from "../models/profile";
import {OpenAiQueryController} from "../open-ai-query-controller";
import {ChatGPTClient} from "../clients/open-ai-client";
import OpenAiQuery from "../models/openai.query";

// Global Config
export const opanAiQueryRouter = express.Router();

opanAiQueryRouter.use(express.json());


opanAiQueryRouter.get("/", async (_req: Request, res: Response) => {
    try {
        // @ts-ignore
        const openAiQueries = (await collections.openAiQuery.find({}).toArray()) as OpenAiQuery[];

        res.status(200).send(openAiQueries);
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
});