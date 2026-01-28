import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
  try {
    setError(null);

    const response = await api.post('/auth/register', userData);

    // 👇 backend response ke according
    const { token, _id, name, email, role } = response.data;

    const newUser = { _id, name, email, role };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));

    setUser(newUser);

    return true; // 🔥 BOOLEAN
  } catch (err) {
    const message = err.response?.data?.message || 'Registration failed';
    setError(message);
    return false; // 🔥 BOOLEAN
  }
};

 const login = async ({ email, password }) => {
  try {
    setError(null);

    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', response.data);

    const {
      token,
      _id,
      name,
      email: userEmail, // 👈 RENAME
      role,
    } = response.data;

    const loggedInUser = { _id, name, email: userEmail, role };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));

    setUser(loggedInUser);

    return true;
  } catch (err) {
    const message = err.response?.data?.message || 'Login failed';
    console.error('Login error:', err);
    setError(message);
    return false;
  }
};



  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

 const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/me/update', profileData);

    const updatedUser = response.data.user; // backend se normalized user

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    return { success: true, user: updatedUser };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || 'Update failed',
    };
  }
};


  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
