import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    picture: String,

    provider: String, // 'google', 'facebook',.
    externalId: String, // ID from provider

    friends: [
        {
            externalId: String,
            provider: String,
            name: String,
            email: String,
        },
    ],
});

export default mongoose.model('User', userSchema);
