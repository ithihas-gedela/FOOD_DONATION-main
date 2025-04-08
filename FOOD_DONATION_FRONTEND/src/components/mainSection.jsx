import { Link } from 'react-router';
import './mainSection.css';
const MainSection = ({ User }) => {
  return (
    <>
      <div className="main">
        <img src="/main-image.jpg" className="background-image" />
        <div className="main-details">
          {User.isLoggedin ? (
            <h1 className="text">Welcome {User.name}!</h1>
          ) : (
            ''
          )}
          <h1 className="text">
            Connection food reducing waste, Feeding Hope, Sustainably
          </h1>
          <div className="buttons">
            {User.isLoggedin ? (
              <Link to="/donation">
                <button className="button">Donate</button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="button">Login to donate</button>
              </Link>
            )}

            {User.role === 'ngo' ? (
              <Link to="/request">
                <button className="button">Recieve</button>
              </Link>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainSection;
