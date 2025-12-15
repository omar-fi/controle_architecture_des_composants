import { useState } from 'react';
import ParkingList from './components/ParkingList';
import ParkingSpots from './components/ParkingSpots';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

import HomePage from './components/HomePage';
// ... imports

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedParking, setSelectedParking] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);


  // Auth Hook
  const { user, loading } = useAuth();

  const handleSelectParking = (parking) => {
    setSelectedParking(parking);
  };

  const handleBackToParkings = () => {
    setSelectedParking(null);
  };

  const handleSelectSpot = (spot) => {
    if (!user) {
      // Optional: Alert user they need to login
    }
    setSelectedSpot(spot);
    setActiveTab('reserve');
  };

  const handleReservationComplete = () => {
    setSelectedSpot(null);
    setRefreshKey(prev => prev + 1);
    setActiveTab('reservations');
  };

  const handleCancelReservation = () => {
    setSelectedSpot(null);
    setActiveTab('parking');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'parking' && !selectedParking) {
      // Stay on parking list
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  // Custom Logic for Admin Tab rendering
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={handleTabChange} />;
      case 'parking':
        return !selectedParking ? (
          <ParkingList onSelectParking={handleSelectParking} />
        ) : (
          <ParkingSpots
            key={refreshKey}
            parkingId={selectedParking.id}
            parkingName={selectedParking.nom}
            onSelectSpot={handleSelectSpot}
            onBack={handleBackToParkings}
          />
        );
      case 'reserve':
        return user ? (
          <ReservationForm
            selectedSpot={selectedSpot}
            onReservationComplete={handleReservationComplete}
            onCancel={handleCancelReservation}
          />
        ) : (
          <LoginPage
            onRegisterClick={() => setActiveTab('register')}
            onLoginSuccess={() => setActiveTab('reserve')} // Go back to reserve
          />
        );
      case 'reservations':
        return user ? <ReservationList key={refreshKey} /> : (
          <LoginPage
            onRegisterClick={() => setActiveTab('register')}
            onLoginSuccess={() => setActiveTab('reservations')}
          />
        );
      case 'admin':
        if (user && user.username === 'admin') {
          return <AdminDashboard />;
        } else if (user) {
          // User is logged in but NOT admin
          return <div className="error">Accès refusé. Réservé aux administrateurs.</div>;
        } else {
          return (
            <LoginPage
              onRegisterClick={() => setActiveTab('register')}
              onLoginSuccess={() => setActiveTab('admin')}
            />
          );
        }
      case 'login':
        return (
          <LoginPage
            onRegisterClick={() => setActiveTab('register')}
            onLoginSuccess={() => {
              // Determine where to go based on role - wait for state update or check logic
              // Since user state might not be updated immediately in this callback context, 
              // we rely on the fact that AuthContext updates it. 
              // A safer bet is to default to 'parking' unless they were trying to access admin.
              setActiveTab('parking');
            }}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onLoginClick={() => setActiveTab('login')}
            onRegisterSuccess={() => setActiveTab('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="content">
        {renderContent()}
      </main>

      <footer className="footer">
        <p>Smart Parking System © 2024 - Gateway: localhost:8080</p>
      </footer>
    </div>
  );
}

// Wrapper to provide Auth Context
import DrivingCar from './components/DrivingCar';

// ... (existing helper function if needed, but imports are at the top)

// Wrapper to provide Auth Context
function App() {
  return (
    <AuthProvider>
      <AppContent />
      <DrivingCar />
    </AuthProvider>
  );
}

export default App;
