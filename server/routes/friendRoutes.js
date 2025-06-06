import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/add', async (req, res) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) return res.status(400).json({ error: 'userId and friendId are required' });

    try {
        const user = await User.findOneAndUpdate(
            { googleId: userId },
            { $addToSet: { friends: friendId } },
            { new: true }
        );
        res.json(user);
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
        const friends = await User.find({ _id: { $in: req.user._id } });

        res.json(friends);
    } catch (err) {
        console.error('Error getting friends:', err);
        res.status(500).json({ error: 'Error getting friends' });
    }
});

export default router;
