import AvailableFoodList from '../components/AvailableFood';
import Chatbot from '../components/Chatbot';
import Footer from '../components/footer';

import HowItWorks from '../components/howItWorks';
import MainSection from '../components/mainSection';
import NavBar from '../components/nabar';
import SDGSection from '../components/SDGSection';
import WhyDonate from '../components/WhyDonate';

const HomePage = ({ User, handleLogout }) => {
  return (
    <>
      <NavBar User={User} handleLogout={handleLogout} />
      <MainSection User={User} />
      <HowItWorks />
      <SDGSection />
      <WhyDonate />
      <Footer />
      <Chatbot />
    </>
  );
};

export default HomePage;
