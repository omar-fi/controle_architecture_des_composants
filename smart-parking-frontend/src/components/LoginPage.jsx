import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function LoginPage({ onRegisterClick, onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(username, password);
        if (success) {
            if (onLoginSuccess) onLoginSuccess();
        } else {
            setError('Identifiants incorrects');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Connexion</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Se connecter</button>
                </form>
                <p className="auth-switch">
                    Pas encore de compte ? <button onClick={onRegisterClick}>S'inscrire</button>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
