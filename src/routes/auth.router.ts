import { Request, Response, Router } from 'express';
import passport, {GOOGLE_CLIENT_ID} from '../passport';

const router: Router = Router();

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req: Request, res: Response) => {
        try {
            console.log(req.user);
            res.redirect('http://localhost:3000/login');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
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
