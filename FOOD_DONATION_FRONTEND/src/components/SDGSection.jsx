import React from 'react';
import './sdgSection.css';
import sdgImage from '../assets/sdgimg.jpg';

const SDGSection = () => {
  return (
    <div className="sdg-section">
      {/* ✅ Left Side: Image */}
      <div className="sdg-image">
        <img src={sdgImage} alt="Sustainable Development Goals" />
      </div>

      {/* ✅ Right Side: Content */}
      <div className="sdg-content">
        <h2>Our Commitment to Sustainability</h2>
        <ul className="sdg-points">
          <li>Contributing to zero hunger through food donations</li>
          <li>Supporting responsible consumption & reduced waste</li>
          <li>Ensuring sustainable cities with food redistribution</li>
          <li>Strengthening partnerships for a better impact</li>
        </ul>
      </div>
    </div>
  );
};

export default SDGSection;
