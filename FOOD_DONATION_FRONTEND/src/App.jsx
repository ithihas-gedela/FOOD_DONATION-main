import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/homePage';
import Login from './pages/login';
import Signup from './pages/signup';
import { useEffect, useState } from 'react';
import cookie from 'js-cookie';
import DonateFood from '../src/components/Donatefood';
import AvailableFoodList from './components/AvailableFood';
import DonorDashboard from './components/DonarContribution';
import '@fortawesome/fontawesome-free/css/all.min.css';
const App = () => {
  const [User, setUser] = useState(() => {
    const isLoggedin = localStorage.getItem('isLoggedIn');
    console.log(isLoggedin);
    if (isLoggedin) {
      return {
        isLoggedin: true,
      };
    } else {
      return {
        isLoggedin: false,
        name: 'User',
      };
    }
  });

  console.log(User);

  const afterLogin = (resObj) => {
    alert('login sucessfull');
    const newUser = { isLoggedin: true, name: resObj.data.name };
    localStorage.setItem('isLoggedIn', true);
    setUser(newUser);
  };

  const getLoggedUserInfo = async () => {
    try {
      console.log('Hello');
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + '/users/me', {
        credentials: 'include',
      });
      const respObj = await resp.json();
      console.log(respObj);
      if (respObj.status === 'success') {
        setUser({
          isLoggedin: true,
          email: respObj.data.email,
          name: respObj.data.name,
          role: respObj.data.role,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const resp = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/user/logout',
        {
          credentials: 'include',
        }
      );
      const respObj = await resp.json();
      console.log(respObj);
      if (respObj.status === 'success') {
        localStorage.removeItem('isLoggedIn');
        alert('logout sucessfully');
        setUser({
          isLoggedin: false,
          name: 'User',
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (User.isLoggedin) {
      getLoggedUserInfo();
    }
  }, [User.isLoggedin]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = cookie.get('authorization');

      if (!token) {
        console.log('Token not found. Logging out...');
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (isLoggedIn) {
          localStorage.removeItem('isLoggedIn');
          setUser({ isLoggedin: false, name: 'User' });
        }
        return;
      }

      setTimeout(verifyToken, 200);
    };

    verifyToken();
  }, []);

  const RedirectToHome = () => {
    return <Navigate to="/" />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<HomePage User={User} handleLogout={handleLogout} />}
          />

          <Route
            path="/login"
            element={
              User.isLoggedin ? (
                <RedirectToHome />
              ) : (
                <Login
                  afterLogin={afterLogin}
                  User={User}
                  handleLogout={handleLogout}
                />
              )
            }
          />
          <Route
            path="/signup"
            element={
              User.isLoggedin ? (
                <RedirectToHome />
              ) : (
                <Signup User={User} handleLogout={handleLogout} />
              )
            }
          />
          <Route
            path="/donation"
            element={<DonateFood User={User} handleLogout={handleLogout} />}
          />
          <Route
            path="request"
            element={
              <AvailableFoodList User={User} handleLogout={handleLogout} />
            }
          />

          <Route
            path="/donorDashboard"
            element={<DonorDashboard User={User} handleLogout={handleLogout} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
