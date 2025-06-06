import express from 'express';
import Recommendation from '../models/Recommendation.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { media, from, to, comment } = req.body;
    const { mediaId, title, poster_path, media_type } = media;
    try {
        let recommendation = await Recommendation.findOne({ mediaId, media_type, recommendedTo: to });

        if (recommendation) {
            if (!recommendation.recommendedBy.includes(from)) {
                recommendation.recommendedBy.push(from);
                recommendation.comments.push({ userId: from, text: comment });
                await recommendation.save();
            }
        } else {
            recommendation = new Recommendation({
                mediaId,
                mediaType: media_type,
                title,
                poster_path,
                recommendedTo: to,
                recommendedBy: [from],
                comments: [{ userId: from, text: comment }],
            });
            await recommendation.save();
        }

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: 'Error saving recommendation' });
    }
});

router.get('/', async (req, res) => {
    try {
        const recs = await Recommendation.find({ recommendedTo: req.user.externalId });
        res.json(recs);
    } catch (err) {
        res.status(500).json({ error: 'Error getting recommendations', err });
    }
});

export default router;
