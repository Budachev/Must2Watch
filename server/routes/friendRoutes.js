import express from 'express';
import User from '../models/User.js';
import Recommendation from '../models/Recommendation.js';
const router = express.Router();

router.post('/add', async (req, res) => {
    const { userId, email, name } = req.body;
    const currentUser = await User.findOne({ externalId: userId });

    if (!currentUser) {
        return res.status(404).json({ error: 'Current user not found' });
    }

    if (!email && !name) {
        throw new Error('Email or name is required');
    }

    try {
        const query = email ? { email } : { name };
        const friend = await User.findOne(query).select('_id name email externalId');

        if (!friend) return res.status(404).json({ error: 'Friend not found' });

        const friendData = {
            externalId: friend.externalId,
            provider: friend.provider,
            name: friend.name,
            email: friend.email,
        };

        const updatedUser = await User.findOneAndUpdate(
            {
                _id: currentUser._id,
                'friends.externalId': { $ne: friend.externalId },
            },
            { $addToSet: { friends: friendData } },
            { new: true }
        );

        res.json(updatedUser);
    } catch (err) {
        console.error('Error adding friend:', err);
        res.status(500).json({ error: 'Error adding friend' });
    }
});

router.get('/', async (req, res) => {
    try {
        // const user = await User.findOne({ googleId: req.params.userId });
        // if (!user || !user.friends) return res.json([]);

        // const friends = await User.find({ googleId: { $in: user.friends } }, 'googleId name email picture');
        // res.json(friends);
        // console.log(req.user);
        // const friends = await User.find({ _id: { $in: req.user._id } });

        // res.json(friends);

        const currentUser = await User.find({ _id: { $in: req.user._id } });
        const recommendations = await Recommendation.find({ recommendedBy: req.user.externalId });

        if (currentUser.length) {
            const friends = currentUser[0].friends;
            const grouped = {};

            for (const friend of friends) {
                grouped[friend.externalId] = {
                    friend,
                    recommendations: [],
                };
            }

            for (const rec of recommendations) {
                if (grouped[rec.recommendedTo]) {
                    grouped[rec.recommendedTo].recommendations.push(rec);
                }
            }

            const result = Object.values(grouped);

            res.json(result);
        }

        res.json([]);
    } catch (err) {
        console.error('Error getting friends:', err);
        res.status(500).json({ error: 'Error getting friends' });
    }
});

export default router;
