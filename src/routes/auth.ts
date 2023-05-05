import express from 'express';
import passport, {GOOGLE_CLIENT_ID} from '../passport';
import cors from "cors";

const router = express.Router();

router.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'content-type', 'Origin', 'Content-Type',
        'Accept', 'Authorization', 'Access-Control-Allow-Methods','Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers'],
    credentials: true,
}))
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        console.log(req.user);
        // Redirect the user to the React login page
        res.redirect('http://localhost:3000/login');
    });

// define your routes
router.get('/google', (req, res) => {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth' +
        `?response_type=code` +
        `&redirect_uri=http://localhost:8080/auth/google/callback` +
        `&scope=profile email https://www.googleapis.com/auth/user.birthday.read` +
        `&client_id=${GOOGLE_CLIENT_ID}`;

    res.status(200).json({ url });
});

export default router;
