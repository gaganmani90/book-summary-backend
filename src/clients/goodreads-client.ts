export class GoodreadsClient {
    private static _instance: GoodreadsClient
    public static get Instance() {
        return this._instance || (this._instance = new GoodreadsClient())
    }

    public getTopBooks(): string[] {
            return ["The Monk Who Sold His Ferrari"]
    }
}