import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar({ activeTab, onTabChange }) {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <h1>🚗 Smart Parking</h1>
                </div>

                <div className="navbar-menu">
                    <button
                        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => onTabChange('home')}
                    >
                        🏠 Accueil
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'parking' ? 'active' : ''}`}
                        onClick={() => onTabChange('parking')}
                    >
                        🅿️ Parkings
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'reserve' ? 'active' : ''}`}
                        onClick={() => onTabChange('reserve')}
                    >
                        📝 Réserver
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'reservations' ? 'active' : ''}`}
                        onClick={() => onTabChange('reservations')}
                    >
                        📋 Réservations
                    </button>
                    {user && user.username === 'admin' && (
                        <button
                            className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
                            onClick={() => onTabChange('admin')}
                        >
                            🛠️ Admin
                        </button>
                    )}
                </div>

                <div className="navbar-user">
                    {user ? (
                        <>
                            <span className="user-name">👤 {user.username}</span>
                            <button className="logout-btn-nav" onClick={logout}>Déconnexion</button>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <button
                                className="login-btn-nav"
                                onClick={() => onTabChange('login')}
                            >
                                Connexion
                            </button>
                            <button
                                className="register-btn-nav"
                                onClick={() => onTabChange('register')}
                            >
                                Inscription
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
