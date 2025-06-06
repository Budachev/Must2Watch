export const API_BASE = 'http://localhost:4000/api';
const yo = '5d882c5ed6a93849a9ee9d0c92f019bb';
export const saveUserToDB = async user => {
    const res = await fetch(`${API_BASE}/user/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    return res.json();
};

export const getFavorites = async userId => {
    const res = await fetch(`${API_BASE}/favorites/${userId}`);
    return res.json();
};

export const addFavorite = async ({ userId, mediaId, mediaType }) => {
    const res = await fetch(`${API_BASE}/favorites/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, mediaId, mediaType }),
    });
    return res.json();
};

export const searchMovies = async query => {
    const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${
            process.env.REACT_APP_TMDB_KEY || yo
        }&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    return data.results;
};

export const searchTV = async query => {
    const res = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${
            process.env.REACT_APP_TMDB_KEY || yo
        }&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    return data.results;
};
