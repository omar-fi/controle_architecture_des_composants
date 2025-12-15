import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { parkingApi } from '../api/api';
import './AdminDashboard.css';

function AdminDashboard() {
    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form State
    const [newParking, setNewParking] = useState({
        nom: '',
        adresse: '',
        capacite: ''
    });

    useEffect(() => {
        fetchParkings();
    }, []);

    const fetchParkings = async () => {
        try {
            setLoading(true);
            const response = await parkingApi.getParkings();
            const parkingsData = response.data?._embedded?.parkings || [];
            setParkings(parkingsData);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des parkings.');
            console.error(err);
            setParkings([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewParking(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await parkingApi.createParking(newParking);
            setNewParking({ nom: '', adresse: '', capacite: '' });
            fetchParkings(); // Refresh list
            Swal.fire({
                title: "Nouveau parking ajouté!",
                icon: "success",
                draggable: true
            });
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'ajout du parking");
        }
    };

    const handleDelete = async (parking) => {
        if (!window.confirm(`Voulez-vous vraiment supprimer "${parking.nom}" ?`)) return;

        try {
            const id = parking._links.self.href.split('/').pop();
            await parkingApi.deleteParking(id);
            fetchParkings(); // Refresh list
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression. Vérifiez qu'il n'y a pas de places liées.");
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Administration des Parkings</h2>

            <div className="admin-container">
                {/* Formulaire d'ajout */}
                <div className="admin-card add-parking-form">
                    <h3>➕ Ajouter un Parking</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nom du Parking</label>
                            <input
                                type="text"
                                name="nom"
                                value={newParking.nom}
                                onChange={handleInputChange}
                                required
                                placeholder="Ex: Parking Central"
                            />
                        </div>
                        <div className="form-group">
                            <label>Adresse</label>
                            <input
                                type="text"
                                name="adresse"
                                value={newParking.adresse}
                                onChange={handleInputChange}
                                required
                                placeholder="Ex: 12 Rue de la Paix"
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacité</label>
                            <input
                                type="number"
                                name="capacite"
                                value={newParking.capacite}
                                onChange={handleInputChange}
                                required
                                placeholder="Ex: 50"
                            />
                        </div>
                        <button type="submit" className="submit-btn">Ajouter</button>
                    </form>
                </div>
                {/* Liste des parkings */}
                <div className="admin-card parking-list">
                    <h3>📋 Liste des Parkings existants</h3>
                    {parkings.length === 0 ? (
                        <p>Aucun parking.</p>
                    ) : (
                        <ul className="admin-list">
                            {parkings.map(parking => {
                                const id = parking._links.self.href.split('/').pop();
                                return (
                                    <li key={id} className="admin-list-item">
                                        <div>
                                            <strong>{parking.nom}</strong>
                                            <br />
                                            <small>{parking.adresse}</small>
                                        </div>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(parking)}
                                        >
                                            🗑️ Supprimer
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
