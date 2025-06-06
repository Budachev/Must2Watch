import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { to, from, mediaId, mediaType, comment } = req.body;
    try {
        const notif = new Notification({ to, from, mediaId, mediaType, comment });
        await notif.save();
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка создания уведомления' });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const notifs = await Notification.find({ to: req.params.userId }).sort({ createdAt: -1 });
        res.json(notifs);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка загрузки уведомлений' });
    }
});

export default router;
