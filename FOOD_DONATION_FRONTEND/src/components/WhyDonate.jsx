import React from 'react';
import './whyDonate.css';
import firstImage from '../assets/first_image.jpeg';

const WhyDonate = () => {
  const cards = [
    {
      id: 1,
      title: 'Direct Impact',
      description:
        'Your donations go directly to those in need, reducing food waste and fighting hunger effectively.',
      // image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmMopgu9qhrqdIeGRc4rq52Z63AkSX3-_m1w&s",
      image: firstImage,
    },
    {
      id: 2,
      title: 'Trusted & Transparent',
      description:
        'We ensure transparency and accountability, so you know exactly where your donations are going.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjS-sfalS6IzvbhhMBgLQPQoJhm6gB8lfkXQ&s',
    },
    {
      id: 3,
      title: 'Simple & Convenient',
      description:
        'Easily donate food through our platform with hassle-free pickup and distribution services.',
      image: 'https://trellis.net/wp-content/uploads/2024/07/foodwasteapp.png',
    },
    {
      id: 4,
      title: 'Strong Partnerships',
      description:
        'We collaborate with NGOs, businesses, and communities to maximize our impact.',
      image:
        'https://thumbs.dreamstime.com/b/sleek-modern-handshake-logo-symbolizing-professionalism-trust-perfect-business-finance-corporate-branding-emphasizing-346902355.jpg',
    },
  ];

  return (
    <div className="why-donate-section">
      <h2>Why Donate Through Food Bridge NGO?</h2>
      <div className="card-container">
        {cards.map((card) => (
          <div key={card.id} className="donate-card">
            <img src={card.image} alt={card.title} className="card-image" />
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <a href="#" className="read-more">
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyDonate;
