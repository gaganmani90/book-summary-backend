// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Book from "../models/book";
import {httpLogger} from "./profile.router";

// Global Config
export const bookRouter = express.Router();

bookRouter.use(express.json());
bookRouter.use(httpLogger)

// GET
bookRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {

        const query = { _id: new ObjectId(id) };
        // @ts-ignore
        const book: Book = (await collections.games.findOne(query)) as Book;

        if (book) {
            res.status(200).send(book);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

// POST

bookRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newBook: Book = req.body as Book;
        // @ts-ignore
        const result = await collections.games.insertOne(newBook);

        result
            ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new game.");
    } catch (error) {
        console.error(error);
        // @ts-ignore
        res.status(400).send(error.message);
    }
});

// PUT
bookRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedBook: Book = req.body as Book;
        const query = { _id: new ObjectId(id) };

        // @ts-ignore
        const result = await collections.games.updateOne(query, { $set: updatedBook });

        result
            ? res.status(200).send(`Successfully updated book summary with id ${id}`)
            : res.status(304).send(`Book summary with id: ${id} not updated`);
    } catch (error) {
        // @ts-ignore
        console.error(error.message);
        // @ts-ignore
        res.status(400).send(error.message);
    }
});

// DELETE
bookRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        // @ts-ignore
        const result = await collections.games.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed game with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove game with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Game with id ${id} does not exist`);
        }
    } catch (error) {
        // @ts-ignore
        console.error(error.message);
        // @ts-ignore
        res.status(400).send(error.message);
    }
});

bookRouter.get("/", async (_req: Request, res: Response) => {
    try {
        // @ts-ignore
        const books = (await collections.games.find({}).toArray()) as Book[];

        res.status(200).send(books);
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
});