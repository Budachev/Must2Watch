import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

// interface FavoriteButtonProps {
//     mediaId: number;
//     mediaType: 'movie' | 'tv';
//     userId: string;
// }

const FavoriteButton = ({ mediaId, mediaType, userId }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (userId) {
            axiosInstance.get(`/favorites`).then(res => {
                const exists = res.data.some(item => item.mediaId === mediaId);
                setIsFavorite(exists);
            });
        }
    }, [mediaId, userId]);

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await axiosInstance.delete('favorites', { data: { userId, mediaId } });
            } else {
                await axiosInstance.post('/favorites', { userId, mediaId, mediaType });
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={toggleFavorite} className="text-white bg-purple-600 px-4 py-1 rounded">
            {isFavorite ? 'Add to favorite' : 'Remove from favorite'}
        </button>
    );
};

export default FavoriteButton;
