import { useState } from 'react';
import FavoriteButton from './FavoriteButton';
import { useUser } from '../context/UserContext';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200';

const MediaCard = ({ item, isFavorite, toggleFavorite, friends, onRecommend }) => {
    const [selectedFriend, setSelectedFriend] = useState('');
    const { user } = useUser();

    const handleRecommend = () => {
        if (selectedFriend) {
            onRecommend(item, selectedFriend);
            setSelectedFriend('');
        }
    };

    return (
        <div className="bg-white rounded shadow p-4 relative">
            {item.poster_path && (
                <img src={IMAGE_BASE_URL + item.poster_path} alt={item.title || item.name} className="rounded mb-2 " />
            )}
            <h3 className="text-lg font-semibold">
                {item.title || item.name} ({(item.release_date || item.first_air_date)?.slice(0, 4) || '—'})
            </h3>
            <p className="text-sm text-gray-600 mb-2">⭐ {item.vote_average}</p>
            <p className="text-sm text-gray-700">{item.overview || 'No description.'}</p>
            {/* <button
                onClick={toggleFavorite}
                className={`absolute top-2 right-2 text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                title={isFavorite ? 'Remove' : 'Add to favorite'}
            >
                ♥
            </button> */}

            {item.recommendedBy?.length && (
                <p className="text-sm text-blue-600 font-medium mb-2">Recomended: {item.recommendedBy.join(',')}</p>
            )}
            <FavoriteButton mediaId={item.id} userId={user._id} mediaType={'movie'} />

            {friends?.length > 0 && (
                <div className="mt-auto">
                    <select
                        value={selectedFriend}
                        onChange={e => setSelectedFriend(e.target.value)}
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                    >
                        <option value="">Recomend to a friend...</option>
                        {friends.map(friend => (
                            <option key={friend.googleId} value={friend.googleId}>
                                {friend.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleRecommend}
                        disabled={!selectedFriend}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Recomend
                    </button>
                </div>
            )}
        </div>
    );
};
export default MediaCard;
