import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import MediaCard from '../components/MediaCard';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const API_KEY = process.env.REACT_APP_MOVIE_DB_API_KEY;

const Home = () => {
    const { user } = useUser();
    const [query, setQuery] = useState('');
    const [mediaType, setMediaType] = useState('movie');
    const [minRating, setMinRating] = useState(0);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [friends, setFriends] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        if (user) {
            fetchFavorites();
            fetchFriends();
            fetchRecommendations(user.googleId);
        }
    }, [user]);

    const fetchFriends = async () => {
        try {
            const res = await axiosInstance.get(`/friends`);
            setFriends(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchFavorites = async () => {
        try {
            const res = await axiosInstance.get(`/favorites`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setFavorites(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const res = await axiosInstance.get(`${process.env.REACT_APP_BACKEND_URL}/api/recommendations`);
            setRecommendations(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const syncFavorites = async newFavorites => {
        if (!user) return;
        setFavorites(newFavorites);
        try {
            await axiosInstance.post(`${process.env.REACT_APP_BACKEND_URL}/api/favorites`, {
                googleId: user._id,
                favorites: newFavorites,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleRecommend = async (item, friend) => {
        try {
            await axiosInstance.post(`${process.env.REACT_APP_BACKEND_URL}/api/recommendations`, {
                from: user.externalId,
                to: friend.externalId,
                comment: 'you should definetly check this out',
                media: {
                    mediaId: item.id,
                    title: item.title || item.name,
                    vote_average: item.vote_average,
                    poster_path: item.poster_path,
                    media_type: mediaType,
                },
            });
            alert(`Recomended to a friend ${friend.name}`);
        } catch (error) {
            console.error(error);
        }
    };

    const search = async () => {
        if (!query.trim()) return;

        try {
            const movies = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
                params: {
                    api_key: API_KEY,
                    query: query,
                },
            });
            const shows = await axios.get(`https://api.themoviedb.org/3/search/tv`, {
                params: {
                    api_key: API_KEY,
                    query: query,
                },
            });
            const res = [...movies.data.results, ...shows.data.results];
            console.log(movies, shows, res);
            const filtered = res
                .filter(item => item.vote_average >= minRating)
                .sort((a, b) => b.popularity - a.popularity);

            if (filtered.length === 0) {
                setError('No results');
                setResults([]);
            } else {
                setError('');
                setResults(filtered);
            }
        } catch (err) {
            console.error(err);
            setError(err);
        }
    };

    const toggleFavorite = item => {
        const exists = favorites.find(fav => fav.id === item.id && fav.media_type === mediaType);
        const updated = exists
            ? favorites.filter(fav => fav.id !== item.id)
            : [...favorites, { ...item, media_type: mediaType }];
        syncFavorites(updated);
    };

    const isFavorite = id => favorites.some(fav => fav.id === id);

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Search</h1>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Type something..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') search();
                    }}
                    className="p-2 border border-gray-300 rounded w-full sm:w-64"
                />

                <input
                    type="number"
                    min="0"
                    max="10"
                    value={minRating}
                    onChange={e => setMinRating(Number(e.target.value))}
                    placeholder="Min. rating"
                    className="p-2 border border-gray-300 rounded w-32"
                />

                <button
                    onClick={search}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map(item => (
                    <MediaCard
                        key={item.id}
                        item={item}
                        isFavorite={isFavorite(item.id)}
                        toggleFavorite={() => toggleFavorite(item)}
                        friends={friends}
                        onRecommend={handleRecommend}
                    />
                ))}
            </div>

            {recommendations.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Friends recomendations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {recommendations.map(item => (
                            <MediaCard
                                key={item.id}
                                item={item}
                                isFavorite={isFavorite(item.id)}
                                toggleFavorite={() => toggleFavorite(item)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
