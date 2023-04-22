import Profile from "./models/profile";

export class ChatGPTQuery {
    public static recommendTopBooks(profile: Profile): string {
        var query = ""
        const prefix = `recommend top ${queryParams.bookCount} books for`
        return prefix + ` ${profile.age} , ${profile.gender} in ${queryParams.wordsLimit} words`
    }
}

const queryParams = {
    bookCount: 5,
    wordsLimit: 20,
    withSummary: false
}