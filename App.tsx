import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './Redux/store';
import { login, logout } from './Redux/auth';
import LoginScreen from './components/LoginScreen';
import ProblematicReservationsListScreen from './components/ProblematicReservationsListScreen';
import {Routes, Route, Navigate } from 'react-router-dom';
import Error404 from './components/Error404';
const IS_LOGGED_IN_KEY = 'isLoggedIn';
const EMAIL_KEY = 'email';
function App() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isAuthenticated);
  const username = useSelector((state: RootState) => state.auth.username);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem(IS_LOGGED_IN_KEY);
    const storedEmail = localStorage.getItem(EMAIL_KEY);

    if (storedIsLoggedIn === 'true' && storedEmail) {
      dispatch(login({ username: storedEmail, password: '' }));
    }
  }, [dispatch]);

  const loginHandler = (username: string, password: string) => {
    dispatch(login({ username, password }));
  };

  const logoutHandler = () => {
    localStorage.removeItem(IS_LOGGED_IN_KEY); // Remove the logged-in state from localStorage
    localStorage.removeItem(EMAIL_KEY); // Remove the stored email
    dispatch(logout());
  };

  return (
    <Container>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <LoginScreen onLogin={loginHandler} email={username || ''} />
            ) : (
              <Navigate to="/problematic_reservations" />
            )
          }
        />
        <Route
          path="/problematic_reservations"
          element={
            isLoggedIn ? (
              <ProblematicReservationsListScreen onLogout={logoutHandler} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Container>
  );
}


export default App;
