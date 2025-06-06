import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
    to: String, // googleId получателя
    from: String, // googleId отправителя
    mediaId: Number,
    mediaType: String,
    comment: String,
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
});

export default mongoose.model('Notification', notificationSchema);
