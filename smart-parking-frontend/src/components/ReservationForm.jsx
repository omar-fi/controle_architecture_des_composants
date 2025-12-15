import { useState, useEffect } from 'react';
import { reservationApi, notificationApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './ReservationForm.css';

function ReservationForm({ selectedSpot, onReservationComplete, onCancel }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nomClient: user?.username || '',
    email: user?.email || '',
    telephone: '',
    dateDebut: '',
    dateFin: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nomClient: user.username || prev.nomClient,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSpot) return;

    try {
      setLoading(true);
      setMessage(null);

      const reservation = {
        parkingSpotId: selectedSpot.id,
        nomClient: formData.nomClient,
        email: formData.email,
        telephone: formData.telephone,
        dateDebut: formData.dateDebut + ':00',
        dateFin: formData.dateFin + ':00',
        statut: 'ACTIVE'
      };

      await reservationApi.create(reservation);

      // Envoyer email de confirmation
      try {
        await notificationApi.sendConfirmation({
          destinataire: formData.email,
          telephone: formData.telephone,
          type: 'EMAIL',
          sujet: 'Confirmation de réservation',
          message: `Bonjour ${formData.nomClient}, votre réservation pour la place ${selectedSpot.numeroPlace} (${selectedSpot.emplacement}) du ${formData.dateDebut} au ${formData.dateFin} a été confirmée.`
        });
      } catch (notifErr) {
        console.log('Notification non envoyée:', notifErr);
      }

      setMessage({ type: 'success', text: 'Réservation créée avec succès! Un email de confirmation a été envoyé.' });
      setFormData({ nomClient: '', email: '', telephone: '', dateDebut: '', dateFin: '' });

      setTimeout(() => {
        onReservationComplete();
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Erreur lors de la réservation';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Erreur lors de la réservation' });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSpot) {
    return (
      <div className="reservation-form">
        <h2>📝 Nouvelle Réservation</h2>
        <p className="no-spot-selected">Sélectionnez une place disponible dans l'onglet "Places" pour réserver</p>
      </div>
    );
  }

  return (
    <div className="reservation-form">
      <h2>📝 Nouvelle Réservation</h2>

      <div className="selected-spot">
        <h3>Place sélectionnée: {selectedSpot.numeroPlace}</h3>
        <p>{selectedSpot.emplacement}</p>
      </div>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom complet</label>
          <input
            type="text"
            name="nomClient"
            value={formData.nomClient}
            onChange={handleChange}
            required
            placeholder="Jean Dupont"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="jean@email.com"
            />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
              placeholder="0612345678"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date et heure de début</label>
            <input
              type="datetime-local"
              name="dateDebut"
              value={formData.dateDebut}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date et heure de fin</label>
            <input
              type="datetime-local"
              name="dateFin"
              value={formData.dateFin}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Annuler
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Réservation en cours...' : 'Confirmer la réservation'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
