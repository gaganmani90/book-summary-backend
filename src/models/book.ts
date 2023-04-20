// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class Book {
    constructor(public title: string, public summary: string, public id?: ObjectId) {}
}