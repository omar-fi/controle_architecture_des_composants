import { useState, useEffect } from 'react';
import { parkingApi } from '../api/api';
import './ParkingList.css';

function ParkingList({ onSelectParking }) {
    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchParkings();
    }, []);

    const fetchParkings = async () => {
        try {
            setLoading(true);
            const response = await parkingApi.getParkings();
            // Spring Data REST returns embedded list
            setParkings(response.data._embedded.parkings);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des parkings.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Chargement des parkings...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="parking-list-container">
            <h2>📍 Choisissez un Parking</h2>

            <div className="parking-grid">
                {parkings.map(parking => {
                    // Extract ID from self link if not directly available
                    const id = parking._links.self.href.split('/').pop();

                    return (
                        <div
                            key={id}
                            className="parking-card"
                            onClick={() => onSelectParking({ ...parking, id })}
                        >
                            <div className="parking-icon">🏢</div>
                            <h3>{parking.nom}</h3>
                            <p className="parking-address">{parking.adresse}</p>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ParkingList;
