import { useState, useEffect } from 'react';
import { reservationApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './ReservationList.css';

function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchReservations();
  }, [filter, user]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      let response;

      // Admin sees all reservations
      if (user?.username === 'admin') {
        if (filter === 'active') {
          response = await reservationApi.getActive();
        } else {
          response = await reservationApi.getAll();
        }
      } else if (user) {
        // Regular users: show all reservations (email filtering not working)
        // In a real app, you'd filter by user ID from backend
        if (filter === 'active') {
          response = await reservationApi.getActive();
        } else {
          response = await reservationApi.getAll();
        }
      } else {
        setReservations([]);
        setLoading(false);
        return;
      }

      setReservations(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des réservations. Vérifiez que le backend est démarré.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation?')) return;

    try {
      await reservationApi.cancel(id);
      fetchReservations();
    } catch (err) {
      alert('Erreur lors de l\'annulation');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="reservation-list"><div className="loading">Chargement des réservations...</div></div>;
  if (error) return <div className="reservation-list"><div className="error">{error}</div></div>;

  return (
    <div className="reservation-list">
      <div className="section-header">
        <h2>📋 Mes Réservations</h2>
        <div className="header-actions">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Actives
          </button>
          <button className="refresh-btn" onClick={fetchReservations}>🔄</button>
        </div>
      </div>

      {reservations.length === 0 ? (
        <p className="no-data">Aucune réservation trouvée</p>
      ) : (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Email</th>
              <th>Place</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.id}>
                <td>#{res.id}</td>
                <td>{res.nomClient}</td>
                <td>{res.email}</td>
                <td>Place #{res.parkingSpotId}</td>
                <td>{formatDate(res.dateDebut)}</td>
                <td>{formatDate(res.dateFin)}</td>
                <td className={`status-${res.statut?.toLowerCase()}`}>
                  {res.statut}
                </td>
                <td>
                  {res.statut === 'ACTIVE' && (
                    <button
                      className="cancel-reservation-btn"
                      onClick={() => handleCancel(res.id)}
                    >
                      Annuler
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReservationList;
