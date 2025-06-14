import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser } from './api'; // 👈 You already made this

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // re-]load user when refreshing (if token exists)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token).then((fetchedUser) => {
        if (fetchedUser) setUser(fetchedUser);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
