import Profile from "./models/profile";

export class OpenAiQueryController {
    /**
     * recommend top 5 books with title, author and published date for a reader who is female 30
     * @param profile
     */
    public static recommendTopBooksQuery(profile: Profile): string {
        return `recommend top ${queryParams.bookCount} books with title, author and published date for
        a reader who is ${profile.gender} ${profile.age}`

    }
}

const queryParams = {
    bookCount: 5,
    wordsLimit: 20,
    withSummary: false
}