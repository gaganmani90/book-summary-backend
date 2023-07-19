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
import {ProfileController} from "../controller/profile-controller";

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
profileRouter.get("/:id", ProfileController.getProfile);
// POST
profileRouter.post("/", ProfileController.createProfile);
// PUT
profileRouter.put("/:id", ProfileController.putProfile);

// DELETE
profileRouter.delete("/:id", ProfileController.deleteProfile);

profileRouter.get("/", ProfileController.getAllProfiles);