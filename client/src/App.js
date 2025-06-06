import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext';
import Home from './pages/home';
import Favorites from './pages/favorites';
import Header from './components/Header';

const AppContent = () => {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favorites" element={<Favorites />} />
            </Routes>
        </div>
    );
};

const App = () => {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <UserProvider>
                <Router>
                    <AppContent />
                </Router>
            </UserProvider>
        </GoogleOAuthProvider>
    );
};

export default App;
