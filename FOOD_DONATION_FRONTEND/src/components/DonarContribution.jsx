import React, { useEffect, useState } from 'react';
import './DonarDashboard.css';
import NavBar from './nabar';

const DonorDashboard = ({ User, handleLogout }) => {
  const [donatedFood, setDonatedFood] = useState([]);
  const [message, setMessage] = useState('');

  // ✅ Fetch Donated Food from Backend
  const fetchDonatedFood = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/donor/food',
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (response.ok) {
        setDonatedFood(data.donatedFood);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error fetching donated food.');
    }
  };

  useEffect(() => {
    fetchDonatedFood();
  }, []);

  // ✅ Count donations
  const totalDonations = donatedFood.length;

  return (
    <>
      <NavBar User={User} handleLogout={handleLogout} />

      <div className="donor-dashboard">
        <h2>🎉 Thank You for Your Generous Donations! 🎉</h2>

        {message && <p className="message">{message}</p>}

        {totalDonations === 0 ? (
          <p className="no-donations">
            You haven’t donated any food yet. Start making an impact today! 🌍✨
          </p>
        ) : (
          <div className="donated-food-list">
            {/* ✅ Summary Section */}
            <div className="donation-summary">
              <h3>Total Donations: {totalDonations}</h3>
            </div>

            {/* ✅ List of Donated Food */}
            {donatedFood.map((food) => (
              <div key={food._id} className="food-item">
                <h3>🍽 {food.foodType}</h3>
                <p>
                  <strong>Food Name:</strong> {food.foodName || 'N/A'}
                </p>
                <p>
                  <strong>Quantity:</strong> {food.quantity || 'N/A'}
                </p>
                <p>
                  <strong>Expiry Date:</strong> {food.expiryDate}
                </p>
                <p>
                  <strong>Location:</strong> {food.location || 'N/A'}
                </p>
                <p>
                  <strong>Contact:</strong> {food.donorContact || 'N/A'}
                </p>
                <p className="donated-message">✅ You Donated This Food! 🙌</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DonorDashboard;
