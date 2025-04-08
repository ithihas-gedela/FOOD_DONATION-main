import { useEffect, useState } from 'react';
import './AvailableFoodList.css';
import NavBar from './nabar';

const AvailableFoodList = ({ User, handleLogout }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAvailableFood();
  }, []);

  const fetchAvailableFood = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/available'
      );
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      console.error('Error fetching food:', error);
    }
  };

  const handleReceive = async (foodId) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + `/${foodId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Requested' }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        fetchAvailableFood(); // Refresh list after requesting food
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error requesting food.');
    }
  };

  return (
    <>
      <NavBar User={User} handleLogout={handleLogout} />
      <div className="food-container">
        <h2>Available Food</h2>
        {message && <p className="message">{message}</p>}

        {foodItems.length === 0 ? (
          <p>No food available at the moment.</p>
        ) : (
          <ul className="food-list">
            {foodItems.map((food) => (
              <li key={food._id} className="food-item">
                <h3>{food.foodName}</h3>
                <p>
                  <strong>Quantity:</strong> {food.quantity}
                </p>
                <p>
                  <strong>Location:</strong> {food.location}
                </p>
                <p>
                  <strong>Donor:</strong> {food.donor?.name || 'Anonymous'}
                </p>
                <p>
                  <strong>Phone:</strong> {food.donor?.phone || 'Not Available'}
                </p>

                {/* Hide the "Receive" button if the logged-in user is the donor */}
                {console.log(User.email, food.donor.email)}
                {console.log(User.email !== food.donor.email)}
                {User.email !== food.donor?.email ? (
                  <button onClick={() => handleReceive(food._id)}>
                    Receive
                  </button>
                ) : (
                  <>
                    <button className="donation-button">your donation</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AvailableFoodList;
