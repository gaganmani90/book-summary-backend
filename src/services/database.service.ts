// External Dependencies
import * as mongoDB from "mongodb";
import {validateBookSchema} from "../models/book";
import {createProfileUniqueIndex, validateProfileSchema} from "../models/profile";
import {createUniqueIndex} from "../models/openai.query";
import RedisClient from "../cache/redis-client";

export const BOOK_DB_NAME = process.env.DB_NAME!!
export const DB_CONNECTION_STRING = process.env.DB_CONN_STRING!!
// Global Variables
export const collections: {
    bookSummary?: mongoDB.Collection,
    profile?: mongoDB.Collection,
    openAiQuery?: mongoDB.Collection
} = {}

export async function bootstrap() {
    await connectToDatabase()
    await RedisClient.connect()
}
// Initialize Connection
async function connectToDatabase() {
    const BOOK_DB_NAME = process.env.DB_NAME!!
    const DB_CONNECTION_STRING = process.env.DB_CONN_STRING!!
    const BOOK_SUMMARY_COLLECTION = process.env.BOOK_SUMMARY_COLLECTION_NAME!!
    const PROFILE_COLLECTION_NAME = process.env.PROFILE_COLLECTION_NAME!!
    const OPENAI_QUERY__COLLECTION_NAME = process.env.OPENAI_QUERY_COLLECTION_NAME!!

    console.log("connecting to db...")

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONNECTION_STRING);

    await client.connect();

    const db: mongoDB.Db = client.db(BOOK_DB_NAME);

    await validateBookSchema(db)
    await validateProfileSchema(db)

    collections.bookSummary = db.collection(BOOK_SUMMARY_COLLECTION);
    collections.profile = db.collection(PROFILE_COLLECTION_NAME);
    collections.openAiQuery = db.collection(OPENAI_QUERY__COLLECTION_NAME)

    //create unique index
    await createUniqueIndex(collections.openAiQuery)
    await createProfileUniqueIndex(collections.profile)

    console.log(`connected to database: ${db.databaseName}; connection: ${DB_CONNECTION_STRING}`);
}
