import React from 'react';
import TalkingAvatar from './TalkingAvatar';
import './HomePage.css';

function HomePage({ onNavigate }) {
    return (
        <div className="home-page">
            <header className="hero-section">
                <TalkingAvatar />
                <div className="hero-content">
                    <h1>Bienvenue sur <span>Smart Parking</span></h1>
                    <p className="hero-subtitle">Le stationnement intelligent de demain, aujourd'hui.</p>
                    <div className="hero-buttons">
                        <button className="cta-btn primary" onClick={() => onNavigate('parking')}>Trouver une place</button>
                        <button className="cta-btn secondary" onClick={() => onNavigate('reserve')}>Réserver</button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="car-3d">🏎️</div>
                </div>
            </header>

            <section className="features-section">
                <div className="feature-card">
                    <div className="icon">⚡</div>
                    <h3>Temps Réel</h3>
                    <p>Consultez la disponibilité des places en direct grâce à nos capteurs IoT.</p>
                </div>
                <div className="feature-card">
                    <div className="icon">🔒</div>
                    <h3>Réservation Sécurisée</h3>
                    <p>Planifiez à l'avance et sécurisez votre place en quelques clics.</p>
                </div>
                <div className="feature-card">
                    <div className="icon">📱</div>
                    <h3>Notifications</h3>
                    <p>Recevez des alertes et confirmations instantanées par email et SMS.</p>
                </div>
            </section>

            <section className="stats-section">
                <div className="stat-item">
                    <span className="count">5+</span>
                    <span className="label">Parkings</span>
                </div>
                <div className="stat-item">
                    <span className="count">750+</span>
                    <span className="label">Places</span>
                </div>
                <div className="stat-item">
                    <span className="count">24/7</span>
                    <span className="label">Surveillance</span>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
