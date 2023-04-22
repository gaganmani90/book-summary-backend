// External Dependencies
import express, {Request, response, Response} from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Profile from "../models/profile";
import {ChatGPTQuery} from "../ChatGPTQuery";
import {ChatGPTClient} from "../clients/open-ai-client";
import OpenAiQuery from "../models/openai.query";

// Global Config
export const profileRouter = express.Router();

profileRouter.use(express.json());

// GET
profileRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {

        const query = { _id: new ObjectId(id) };
        // @ts-ignore
        const profile: Profile = (await collections.profile.findOne(query)) as Profile;
        const openAiQuery = ChatGPTQuery.recommendTopBooks(profile)
        var queryObject: OpenAiQuery
        const value = await ChatGPTClient.Instance.openAiResponse(openAiQuery)
        queryObject = new OpenAiQuery(profile.id!!, openAiQuery, value)
        console.log(`insert chatGPT response to DB with object ${queryObject.toString()}`)
        // @ts-ignore
        const insertedObject = await collections.openAiQuery.insertOne(queryObject);
        if (profile) {
            res.status(200).send(queryObject);
        }

    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

// POST

profileRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newBook: Profile = req.body as Profile;
        // @ts-ignore
        const result = await collections.profile.insertOne(newBook);

        result
            ? res.status(201).send(`Successfully created a new profile with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new profile.");
    } catch (error) {
        console.error(error);
        // @ts-ignore
        res.status(400).send(error.message);
    }
});

// PUT
profileRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedBook: Profile = req.body as Profile;
        const query = { _id: new ObjectId(id) };

        // @ts-ignore
        const result = await collections.profile.updateOne(query, { $set: updatedBook });

        result
            ? res.status(200).send(`Successfully updated profile with id ${id}`)
            : res.status(304).send(`Profile with id: ${id} not updated`);
    } catch (error) {
        // @ts-ignore
        console.error(error.message);
        // @ts-ignore
        res.status(400).send(error.message);
    }
});

// DELETE
profileRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        // @ts-ignore
        const result = await collections.profile.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed profile with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove profile with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Profile with id ${id} does not exist`);
        }
    } catch (error) {
        // @ts-ignore
        console.error(error.message);
        // @ts-ignore
        res.status(400).send(error.message);
    }
});

profileRouter.get("/", async (_req: Request, res: Response) => {
    try {
        // @ts-ignore
        const profiles = (await collections.profile.find({}).toArray()) as Profile[];

        res.status(200).send(profiles);
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
});