import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { useUser } from '../context/UserContext';

const FavoritesPage = () => {
    const { user } = useUser();
    const [favorites, setFavorites] = useState([]);
    const [mediaData, setMediaData] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const res = await axiosInstance.get(`/favorites`);
            setFavorites(res.data);
        };
        if (user?._id) {
            fetchFavorites();
        }
    }, [user]);

    useEffect(() => {
        const fetchDetails = async () => {
            const details = await Promise.all(
                favorites.map(async fav => {
                    const url = `https://api.themoviedb.org/3/${fav.mediaType}/${fav.mediaId}?api_key=5d882c5ed6a93849a9ee9d0c92f019bb&language=en`;
                    const res = await axios.get(url);
                    return { ...res.data, mediaType: fav.mediaType };
                })
            );
            setMediaData(details);
        };

        if (favorites.length) fetchDetails();
    }, [favorites]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Favorite</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaData.map(item => (
                    <div key={item.id} className="bg-gray-800 p-2 rounded">
                        <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name} />
                        <p className="text-white mt-2 text-sm">{item.title || item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;
