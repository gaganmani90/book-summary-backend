// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import {validateBookSchema} from "../models/book";
import {validateProfileSchema} from "../models/profile";

export const BOOK_DB_NAME = process.env.DB_NAME!!
export const DB_CONNECTION_STRING = process.env.DB_CONN_STRING!!
// Global Variables
export const collections: {
    games?: mongoDB.Collection,
    bookSummary?: mongoDB.Collection,
    profile?: mongoDB.Collection,
    openAiQuery?: mongoDB.Collection
} = {}

// Initialize Connection
export async function connectToDatabase() {
    const BOOK_DB_NAME = process.env.DB_NAME!!
    const DB_CONNECTION_STRING = process.env.DB_CONN_STRING!!
    const BOOK_SUMMARY_COLLECTION = process.env.BOOK_SUMMARY_COLLECTION_NAME!!
    const PROFILE_COLLECTION_NAME = process.env.PROFILE_COLLECTION_NAME!!
    const OPENAI_QUERY__COLLECTION_NAME = process.env.OPENAI_QUERY_COLLECTION_NAME!!

    console.log("connecting to db...")
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONNECTION_STRING);
    console.log(`successfully got the client ${client}`)

    await client.connect();
    console.log(`connected`)

    const db: mongoDB.Db = client.db(BOOK_DB_NAME);

    await validateBookSchema(db)
    await validateProfileSchema(db)

    collections.games = db.collection(BOOK_SUMMARY_COLLECTION);
    collections.bookSummary = db.collection(BOOK_SUMMARY_COLLECTION);
    collections.profile = db.collection(PROFILE_COLLECTION_NAME);
    collections.openAiQuery = db.collection(OPENAI_QUERY__COLLECTION_NAME)

    console.log(`Successfully connected to database: ${db.databaseName}; connection: ${DB_CONNECTION_STRING}`);
}
