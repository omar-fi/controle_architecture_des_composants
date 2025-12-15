import axios from 'axios';

// Appels directs aux services (le gateway a des problèmes de timeout)
const PARKING_API = 'http://localhost:8081/api';
const RESERVATION_API = 'http://localhost:8082/api';
const NOTIFICATION_API = 'http://localhost:8083/api';
const IDENTITY_API = 'http://localhost:8084/api'; // Assuming this pattern based on other APIs

// Identity/Auth API
export const identityApi = {
  register: (user) => axios.post(`${IDENTITY_API}/auth/register`, user),
  login: (credentials) => axios.post(`${IDENTITY_API}/auth/token`, credentials),
  validate: (token) => axios.get(`${IDENTITY_API}/auth/validate?token=${token}`)
};

// Parking API
export const parkingApi = {
  getAllSpots: () => axios.get(`${PARKING_API}/parking-spots`),
  getAvailableSpots: () => axios.get(`${PARKING_API}/parking-spots/search/disponibles?statut=DISPONIBLE`),
  getSpotById: (id) => axios.get(`${PARKING_API}/parking-spots/${id}`),
  updateSpot: (id, data) => axios.put(`${PARKING_API}/parking-spots/${id}`, data),
  getParkings: () => axios.get(`${PARKING_API}/parkings`),
  getSpotsByParking: (parkingId) => axios.get(`${PARKING_API}/parking-spots/search/par-parking?parkingId=${parkingId}`),
  createParking: (data) => axios.post(`${PARKING_API}/parkings`, data),
  deleteParking: (id) => axios.delete(`${PARKING_API}/parkings/${id}`)
};

// Reservation API
export const reservationApi = {
  getAll: () => axios.get(`${RESERVATION_API}/reservations`),
  getById: (id) => axios.get(`${RESERVATION_API}/reservations/${id}`),
  create: (data) => axios.post(`${RESERVATION_API}/reservations`, data),
  cancel: (id) => axios.put(`${RESERVATION_API}/reservations/${id}/annuler`),
  getByEmail: (email) => axios.get(`${RESERVATION_API}/reservations/email/${email}`),
  getActive: () => axios.get(`${RESERVATION_API}/reservations/actives`),
  // Récupérer TOUTES les places
  getAvailableSpots: () => axios.get(`${PARKING_API}/parking-spots`)
    .then(res => {
      const spots = res.data._embedded?.parkingSpots || [];
      return spots.map(spot => ({
        ...spot,
        id: parseInt(spot._links.self.href.split('/').pop())
      }));
    })
};

// Notification API
export const notificationApi = {
  send: (data) => axios.post(`${NOTIFICATION_API}/notifications/envoyer`, data),
  sendConfirmation: (data) => axios.post(`${NOTIFICATION_API}/notifications/reservation-confirmee`, data),
  sendReminder: (data) => axios.post(`${NOTIFICATION_API}/notifications/rappel-reservation`, data)
};

export default axios;
