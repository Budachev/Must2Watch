import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // googleId
    mediaId: { type: Number, required: true },
    mediaType: { type: String, required: true }, // 'movie' или 'tv'
});

export default mongoose.model('Favorite', favoriteSchema);
