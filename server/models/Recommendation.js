import mongoose from 'mongoose';
const recommendationSchema = new mongoose.Schema({
    poster_path: String,
    title: String,
    mediaId: Number,
    mediaType: String,
    recommendedBy: String,
    recommendedTo: String,
    comments: [
        {
            userId: String,
            text: String,
            date: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Recommendation', recommendationSchema);
