import React from 'react';
import './howItWorks.css';

const HowItWorks = () => {
  return (
    <div className="how-it-works-container">
      <h2 className="section-title">How It Works</h2>
      <div className="steps-container">
        <div className="step">
          <div className="step-number">1</div>
          <h3>Donate Surplus Food</h3>
          <p>Donors list extra food for distribution.</p>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <h3>AI Matches Food</h3>
          <p>Our AI finds the nearest people in need.</p>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <h3>Efficient Delivery</h3>
          <p>Volunteers ensure food reaches quickly.</p>
        </div>
        <div className="step">
          <div className="step-number">4</div>
          <h3>Food Reaches the Needy</h3>
          <p>People receive fresh, nutritious food.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
