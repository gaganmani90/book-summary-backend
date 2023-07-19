// External Dependencies
import express, {Request, response, Response} from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import OpenAiQuery from "../models/openai.query";
import {limiter, httpLogger} from "./profile.router";

// Global Config
export const opanAiQueryRouter = express.Router();

opanAiQueryRouter.use(express.json());
opanAiQueryRouter.use(limiter)
opanAiQueryRouter.use(httpLogger)

opanAiQueryRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        // @ts-ignore
        const query = { _id: new ObjectId(id) };
        // @ts-ignore
        const queryResponse: OpenAiQuery = (await collections.openAiQuery.findOne(query)) as OpenAiQuery;

        if (queryResponse) {
            res.status(200).send(queryResponse);
        }
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
});


opanAiQueryRouter.get("/", async (req: Request, res: Response) => {
    const id = req?.query?.profileId as string;
    try {
        var openAiQueries: OpenAiQuery[] = []
        if(id) {
            const query = { profileId: new ObjectId(id) };
            // @ts-ignore
            openAiQueries = (await collections.openAiQuery?.find(query).toArray()) as OpenAiQuery[];
        } else {
            // @ts-ignore
            openAiQueries = (await collections.openAiQuery.find({}).toArray()) as OpenAiQuery[];
        }

        res.status(200).send(openAiQueries);
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
});

opanAiQueryRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        // @ts-ignore
        const result = await collections.openAiQuery.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed openAiQuery with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove openAiQuery with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`openAiQuery with id ${id} does not exist`);
        }
    } catch (error) {
        // @ts-ignore
        console.error(error.message);
        // @ts-ignore
        res.status(400).send(error.message);
    }
});