import passport, {Profile} from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import IUser from '../models/user';
import { google } from 'googleapis';

export const GOOGLE_CLIENT_ID: string="51323753676-ps9ivkieorc1fuikodntrdqg6snv71pi.apps.googleusercontent.com"
export const GOOGLE_CLIENT_SECRET: string="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"

// @ts-ignore
passport.serializeUser((user: IUser, done) => {
    done(null, user);
});

passport.deserializeUser((user: IUser, done) => {
    done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `/auth/google/callback`,
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read']
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {

        const user = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
            age: ''
        };
        done(null, user);
    }));

// Create a separate method to calculate the user's age based on their birthdate
function calculateAge(birthdate: Date): number {
    const now = new Date();
    let age = now.getFullYear() - birthdate.getFullYear();
    const monthDiff = now.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

export default passport;
