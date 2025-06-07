import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useUser } from '../context/UserContext';

const FavoritesPage = () => {
    const { user } = useUser();
    const [friendId, setFriendId] = useState('');
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const res = await axiosInstance.get(`/friends`);
            setFriends(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addFriend = async () => {
        if (!friendId.trim()) return;
        try {
            await axiosInstance.post(`${process.env.REACT_APP_BACKEND_URL}/api/friends/add`, {
                userId: user.externalId,
                email: friendId.trim(),
                name: '',
            });
            alert('Friend added successfully');
            fetchFriends();
            setFriendId('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Favorite</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Add a friend</h2>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Friend email"
                                value={friendId}
                                onChange={e => setFriendId(e.target.value)}
                                className="p-2 border border-gray-300 rounded"
                            />
                            <button
                                onClick={addFriend}
                                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                            >
                                Add
                            </button>
                        </div>

                        {friends?.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-semibold mb-1">Your friend(s):</h3>
                                <ul className="list-disc list-inside text-gray-700">
                                    {friends.map((friend, i) => (
                                        <li key={i}>
                                            {friend.friend.name} - You recomended{' '}
                                            {friend.recommendations.map(r => r.title).join(',')}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
