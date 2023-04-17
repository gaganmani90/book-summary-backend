export class LocalCache {
    private openAiCache;
    private static _instance: LocalCache

    public static get Instance() {
        return this._instance || (this._instance = new LocalCache())
    }
    constructor() {
        console.log("creating new cache instance")
        const NodeCache = require( "node-cache" );
        this.openAiCache = new NodeCache({ stdTTL: 1000000})
    }

    public set(key: string, value: string, ttl = 1000000) {
        console.log("setting cache with key: "+key+" value:"+value)
        this.openAiCache.set(key, value, ttl)
    }

    public get(key: string): string {
        console.log("cache hit for key: "+key)
        return this.openAiCache.get(key)
    }
}