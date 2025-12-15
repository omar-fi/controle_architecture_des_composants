import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function RegisterPage({ onLoginClick, onRegisterSuccess }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await register(username, email, password);
        if (success) {
            setSuccessMsg('Compte créé avec succès ! Vous pouvez vous connecter.');
            setTimeout(() => {
                if (onRegisterSuccess) onRegisterSuccess();
            }, 2000);
        } else {
            setError('Erreur lors de l\'inscription');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Inscription</h2>
                {successMsg && <div className="success-msg">{successMsg}</div>}
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
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <button type="submit" className="submit-btn">S'inscrire</button>
                </form>
                <p className="auth-switch">
                    Déjà un compte ? <button onClick={onLoginClick}>Se connecter</button>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
