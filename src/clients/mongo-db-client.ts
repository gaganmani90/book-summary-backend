import {MongoClient, Db, Collection} from "mongodb";

export class MongoDbClient {
    private static _instance: MongoDbClient
    private database: Db

    public static get Instance() {
        return this._instance || (this._instance = new MongoDbClient())
    }

    constructor() {
        let client: MongoClient = new MongoClient(process.env.DB_CONN_STRING!!)
        this.database = client.db(process.env.DB_NAME)
        this.bookSummaryCollection()
    }

    public bookSummaryCollection() {
        const bookCollection: Collection = this.database.collection(process.env.BOOK_SUMMARY_COLLECTION_NAME!!)
        console.log(`successfully connected to ${this.database.databaseName} and collection ${bookCollection.collectionName}`)
    }
}