// External dependencies
import { ObjectId } from "mongodb";
import * as mongoDB from "mongodb";
import {profileRouter} from "../routes/profile.router";
import {collections} from "../services/database.service";

// Class Implementation
export default class OpenAiQuery {
    constructor(public profileId: ObjectId, public query: string,
                public response: string,
                public _id?: ObjectId) {}

    toString(): string {
        return `profileId: ${this.profileId}; query: ${this.query};
        id: ${this._id}`
    }
}

export const createUniqueIndex = async (collection: mongoDB.Collection) => {
    await collection.createIndex({profileId: 1, query: 1}, {unique: true});
}

export const fetchOpenAiQueryByProfileId = async (collection: mongoDB.Collection, queryObject: OpenAiQuery) => {
    return await collection.findOne({profileId: new ObjectId(queryObject.profileId), query: queryObject.query}) as OpenAiQuery
}

export const validateOpenAiQuerySchema = async (db: mongoDB.Db) => {
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