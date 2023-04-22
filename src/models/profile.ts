// External dependencies
import { ObjectId } from "mongodb";
import * as mongoDB from "mongodb";

// Class Implementation
export default class Profile {
    constructor(public email: string, public age: number,
                public gender: string,
                public id?: ObjectId) {}
}

export const createProfileUniqueIndex = async (collection: mongoDB.Collection) => {
    await collection.createIndex({email: 1}, {unique: true, sparse: true});
}

export const validateProfileSchema = async (db: mongoDB.Db) => {
    const PROFILE_COLLECTION_NAME = process.env.PROFILE_COLLECTION_NAME!!
    await db.command({
        "collMod": PROFILE_COLLECTION_NAME,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["age", "gender", "email"],
                additionalProperties: false,
                properties: {
                    _id: {},
                    age: {
                        bsonType: "int",
                        description: "'age' is required and is a string",
                        minimum: 20,
                        maximum: 70,
                    },
                    gender: {
                        enum: ["male", "female"],
                        description: "'gender' must be either male or female"
                    },
                    email: {
                        bsonType: ["string", "null"],
                        description: "'gender' must be either male or female"
                    }
                }
            }
        }
    });
    console.info(`successfully validated schema of collection: ${PROFILE_COLLECTION_NAME}`)
}