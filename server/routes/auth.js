import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
const router = express.Router();

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    const { token, provider } = req.body;

    if (provider === 'google') {
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { sub: googleId, name, email, picture } = payload;

            let user = await User.findOne({ googleId });

            if (!user) {
                user = await User.create({ googleId, name, email, picture });
            }

            const jwtToken = jwt.sign({ id: user._id, name: user.name, provider: 'google' }, JWT_SECRET, {
                expiresIn: '7d',
            });

            res.json({ token: jwtToken, user });
        } catch (error) {
            console.error('Google auth error:', error);
            res.status(401).json({ error: 'Error with Google auth' });
        }
    } else {
        res.status(400).json({ error: 'Unsupported provider' });
    }
});

export default router;
