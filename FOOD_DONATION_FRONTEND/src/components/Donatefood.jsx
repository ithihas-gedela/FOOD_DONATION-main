import { useState } from 'react';
import './FoodDonationForm.css';
import NavBar from './nabar';

const FoodDonationForm = ({ User, handleLogout }) => {
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    location: '',
    foodType: '',
    expiryDate: '',
    donorContact: '',
    donorEmail: '',
    description: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/donate',
        {
          method: 'POST',
          credentials: 'include', // Sends authentication cookies
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setFormData({
          foodName: '',
          quantity: '',
          location: '',
          foodType: '',
          expiryDate: '',
          donorContact: '',
          donorEmail: '',
          description: '',
        });
      } else {
        setMessage(data.message || 'Failed to donate food.');
      }
    } catch (error) {
      setMessage('An error occurred while donating food.');
    }
  };

  return (
    <>
      <NavBar User={User} handleLogout={handleLogout} />
      <div className="form-container">
        <h2>Donate Food</h2>
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="foodName"
            placeholder="Food Name"
            value={formData.foodName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <select
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            required
          >
            <option value="">Select Food Type</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Perishable">Perishable</option>
            <option value="Non-Perishable">Non-Perishable</option>
          </select>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="donorContact"
            placeholder="Contact Number"
            value={formData.donorContact}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="donorEmail"
            placeholder="Email"
            value={formData.donorEmail}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Additional Details"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          <button type="submit">Donate</button>
        </form>
      </div>
    </>
  );
};

export default FoodDonationForm;
