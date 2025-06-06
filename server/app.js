// const express = require('express');
// const session = require('express-session');
// const Redis = require('ioredis');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');

// const app = express();
// app.use(express.json());
// app.use(cookieParser());

// require('dotenv').config();

// const mongoose = require('mongoose');

// // const app = express();

// // const mongoPassword = 'HW4Ne4lm7TjLWN6B';
// const uri =
//     'mongodb+srv://admin:HW4Ne4lm7TjLWN6B@cluster0.xrqi8pz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// const RedisStore = require('connect-redis');
// const redisClient = new Redis();

// const redisStore = new RedisStore.RedisStore({
//     client: redisClient,
//     prefix: 'sess:',
// });

// app.use(
//     session({
//         store: redisStore,
//         secret: 'super-secret',
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             httpOnly: true,
//             sameSite: 'lax',
//             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
//         },
//     })
// );

// app.use(
//     cors({
//         origin: 'http://localhost:3000',
//         credentials: true,
//     })
// );

// const USERS = [{ username: 'admin', password: '123' }];

// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     const user = USERS.find(u => u.username === username && u.password === password);
//     if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//     req.session.user = { username };
//     res.json({ message: 'Logged in' });
// });

// app.get('/profile', (req, res) => {
//     if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
//     res.json({ username: req.session.user.username });
// });

// app.post('/logout', (req, res) => {
//     req.session.destroy(() => {
//         res.clearCookie('connect.sid');
//         res.json({ message: 'Logged out' });
//     });
// });

// app.use(cors());
// app.use(express.json());

// mongoose
//     // .connect(process.env.MONGO_URI)
//     .connect(uri)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error(err));

// // async function run() {
// //     try {
// //         // Connect the client to the server	(optional starting in v4.7)
// //         await client.connect();
// //         // Send a ping to confirm a successful connection
// //         await client.db('admin').command({ ping: 1 });
// //         console.log('Pinged your deployment. You successfully connected to MongoDB!');
// //     } finally {
// //         // Ensures that the client will close when you finish/error
// //         await client.close();
// //     }
// // }
// // run().catch(console.dir);

// // Схемы
// const userSchema = new mongoose.Schema({
//     googleId: String,
//     name: String,
//     email: String,
//     picture: String,
//     favorites: Array,
// });

// const User = mongoose.model('User', userSchema);

// // Сохраняем/обновляем пользователя
// app.post('/api/user', async (req, res) => {
//     const { googleId, name, email, picture } = req.body;
//     const user = await User.findOneAndUpdate({ googleId }, { name, email, picture }, { upsert: true, new: true });
//     res.json(user);
// });

// // Сохраняем избранное
// app.post('/api/favorites', async (req, res) => {
//     const { googleId, favorites } = req.body;
//     const user = await User.findOneAndUpdate({ googleId }, { favorites }, { new: true });
//     res.json(user.favorites);
// });

// // Получаем избранное
// app.get('/api/favorites/:googleId', async (req, res) => {
//     const user = await User.findOne({ googleId: req.params.googleId });
//     res.json(user?.favorites || []);
// });

// app.listen(3001, () => {
//     console.log('✅ Server running on http://localhost:3001');
// });

// new
import './config.js';
import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import authRoutes from './routes/auth.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { OAuth2Client } from 'google-auth-library';
import authMiddleware from './middleware/auth.js';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: 'Нет токена' });

    const token = authHeader.split(' ')[1];
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        req.user = payload;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: err });
    }
};

const app = express();

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/favorites', authMiddleware, favoriteRoutes);
app.use('/api/friends', authMiddleware, friendRoutes);
app.use('/api/recommendations', authMiddleware, recommendationRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
