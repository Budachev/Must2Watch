import axios from 'axios';

const instance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});

// Вставляем токен из localStorage в заголовок
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
