import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/save', async (req, res) => {
    const { googleId, name, email, picture } = req.body;
    try {
        let user = await User.findOne({ googleId });
        if (!user) {
            user = new User({ googleId, name, email, picture });
            await user.save();
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/:googleId', async (req, res) => {
    try {
        const user = await User.findOne({ googleId: req.params.googleId });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error getting user' });
    }
});

export default router;
