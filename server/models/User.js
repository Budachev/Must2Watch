import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    picture: String,
    friends: [{ type: String }], // массив googleId друзей
});

export default mongoose.model('User', userSchema);
