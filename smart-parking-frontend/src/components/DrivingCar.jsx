import React from 'react';
import './DrivingCar.css';

const DrivingCar = () => {
    return (
        <div className="driving-car-container">
            <div className="car-wrapper">
                <span role="img" aria-label="car" className="car-icon">🏎️</span>
                <div className="wind-effect"></div>
            </div>
        </div>
    );
};

export default DrivingCar;
