// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
export const collections: { games?: mongoDB.Collection } = {}

// Initialize Connection
export async function connectToDatabase () {
    const BOOK_SUMMARY_COLLECTION = process.env.BOOK_SUMMARY_COLLECTION_NAME
    console.log("connecting to db...")
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!!);
    console.log(`successfully got the client ${client}`)

    await client.connect();
    console.log(`connected`)

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    await db.command({
        "collMod": BOOK_SUMMARY_COLLECTION,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "price", "category"],
                additionalProperties: false,
                properties: {
                    _id: {},
                    name: {
                        bsonType: "string",
                        description: "'name' is required and is a string"
                    },
                    price: {
                        bsonType: "number",
                        description: "'price' is required and is a number"
                    },
                    category: {
                        bsonType: "string",
                        description: "'category' is required and is a string"
                    }
                }
            }
        }
    });

    // @ts-ignore
    const gamesCollection: mongoDB.Collection = db.collection(BOOK_SUMMARY_COLLECTION);

    collections.games = gamesCollection;

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${gamesCollection.collectionName}`);
}