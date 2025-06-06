import express from 'express';
import Favorite from '../models/Favorite.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, mediaId, mediaType } = req.body;
    try {
        const existing = await Favorite.findOne({ userId, mediaId });
        if (!existing) {
            const fav = new Favorite({ userId, mediaId, mediaType });
            await fav.save();
        }
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: 'Error addint to favorites' });
    }
});

router.get('/', async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user._id });
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: 'Error getting favorites' });
    }
});

router.delete('/', async (req, res) => {
    const { userId, mediaId } = req.body;
    try {
        await Favorite.deleteOne({ userId, mediaId });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting from favorites' });
    }
});

export default router;
