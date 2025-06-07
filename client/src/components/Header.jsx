import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

const Header = ({ onLogout }) => {
    const { user, logout, saveUser } = useUser();
    const location = useLocation();

    const handleLogout = () => {
        googleLogout();
        logout();
        // setFavorites([]);
        // setFriends([]);
        // setRecommendations([]);
    };
    const saveUserToDB = async decodedUser => {
        try {
            const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/save`, {
                googleId: decodedUser.sub,
                name: decodedUser.name,
                email: decodedUser.email,
                picture: decodedUser.picture,
            });

            return result;
        } catch (error) {
            console.error(error);
        }
    };

    const handleGoogleLogin = async credentialResponse => {
        try {
            const googleToken = credentialResponse.credential;

            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
                token: credentialResponse.credential,
                provider: 'google',
            });

            const { token, user: userFromServer } = res.data;
            localStorage.setItem('jwt', token);
            localStorage.setItem('google_token', googleToken);
            saveUser(userFromServer);
        } catch (error) {
            console.error('Error in handleGoogleLogin:', error);
        }
    };

    return (
        <header className="bg-white shadow p-4 flex justify-between items-center mb-6">
            <div className="flex items-center gap-6">
                <Link
                    to="/"
                    className={`text-xl font-bold ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-800'}`}
                >
                    Home
                </Link>
                {!user ? (
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        // onSuccess={credentialResponse => {
                        //     const decoded = jwtDecode(credentialResponse.credential);
                        //     saveUserToDB(decoded).then(result =>
                        //         saveUser({ ...decoded, ...result.data, token: credentialResponse.credential })
                        //     );
                        // }}
                        onError={() => {
                            console.log('Login error');
                        }}
                    />
                ) : (
                    <>
                        <Link
                            to="/favorites"
                            className={`text-lg ${
                                location.pathname === '/favorites' ? 'text-blue-600' : 'text-gray-700'
                            }`}
                        >
                            Favorite
                        </Link>
                        <Link
                            to="/friends"
                            className={`text-lg ${
                                location.pathname === '/friends' ? 'text-blue-600' : 'text-gray-700'
                            }`}
                        >
                            Friends
                        </Link>
                    </>
                )}
            </div>

            {user ? (
                <div className="flex items-center gap-4">
                    <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                    {/* <span className="text-green-600 font-medium">{user.name}</span> */}
                    <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Logout
                    </button>
                </div>
            ) : null}
        </header>
    );
};

export default Header;
