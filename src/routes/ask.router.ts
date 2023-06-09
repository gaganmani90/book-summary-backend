// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Book from "../models/book";
import {ChatGPTClient} from "../clients/open-ai-client";
import {app} from "../index";

// Global Config
export const askRouter = express.Router();

askRouter.use(express.json());

// GET
askRouter.post('/', async (req: Request, res: Response) => {
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
