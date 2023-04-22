// External dependencies
import { ObjectId } from "mongodb";
import * as mongoDB from "mongodb";

// Class Implementation
export default class Book {
    constructor(public title: string, public summary: string, public id?: ObjectId) {}
}

export const validateBookSchema = async (db: mongoDB.Db) => {
    const BOOK_SUMMARY_COLLECTION = process.env.BOOK_SUMMARY_COLLECTION_NAME!!
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
    console.info(`successfully validated schema of collection: ${BOOK_SUMMARY_COLLECTION}`)
}