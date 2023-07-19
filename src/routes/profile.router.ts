// External Dependencies
import express, {Request, response, Response} from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Profile from "../models/profile";
import {OpenAiQueryController} from "../open-ai-query-controller";
import {ChatGPTClient} from "../clients/open-ai-client";
import OpenAiQuery from "../models/openai.query";
import rateLimit from 'express-rate-limit';
// @ts-ignore
import morgan from 'morgan';

export const httpLogger = morgan('combined');

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 100 requests per windowMs
});


// Global Config
export const profileRouter = express.Router();

profileRouter.use(express.json());
profileRouter.use(limiter)
profileRouter.use(httpLogger)


// GET
profileRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {

        const query = { _id: new ObjectId(id) };
        // @ts-ignore
        const profile: Profile = (await collections.profile.findOne(query)) as Profile;
        console.log(`profile id is ${JSON.stringify(profile)}`)


        const openAiQuery = OpenAiQueryController.recommendTopBooksQuery(profile)
        var queryObject: OpenAiQuery
        const queryResponse = await ChatGPTClient.Instance.openAiResponse(openAiQuery)
        queryObject = new OpenAiQuery(profile._id!!, openAiQuery, queryResponse)
        console.log(`insert chatGPT response to DB with object ${queryObject.toString()}`)

        /**
         * Insert or replace query, profile id and response
         */
        //fetchOpenAiQueryByProfileId(collections.openAiQuery, queryObject)
        const options = {
            upsert: true, // create a new document if it doesn't exist
            returnOriginal: true // return the updated document
        };
        // @ts-ignore
        const insertedObject = await collections.openAiQuery?.findOneAndUpdate(
            {profileId: new ObjectId(queryObject.profileId), query: queryObject.query},
            { $set: {profileId: queryObject.profileId,
                query: queryObject.query,
                response: queryObject.response} },
            options);
        if (profile) {
            res.status(200).send(queryObject);
        }

    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}, err: ${error}`);
    }
});


// POST

profileRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newBook: Profile = req.body as Profile;
        // @ts-ignore
        const result = await collections.profile.insertOne(newBook);

        result
            ? res.status(201).json({id: result.insertedId})
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