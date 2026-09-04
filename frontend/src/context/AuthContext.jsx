import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('tvarit_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tvarit_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const saveAuth = (authResponse) => {
    const { token: jwtToken, ...userData } = authResponse;
    localStorage.setItem('tvarit_token', jwtToken);
    localStorage.setItem('tvarit_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  };

  const loginCustomer = async (email, password) => {
    const response = await authService.loginCustomer(email, password);
    saveAuth(response);
    return response;
  };

  const loginPartner = async (email, password) => {
    const response = await authService.loginPartner(email, password);
    saveAuth(response);
    return response;
  };

  const loginAdmin = async (email, password) => {
    const response = await authService.loginAdmin(email, password);
    saveAuth(response);
    return response;
  };

  const registerCustomer = async (data) => {
    const response = await authService.registerCustomer(data);
    saveAuth(response);
    return response;
  };

  const registerPartner = async (data) => {
    const response = await authService.registerPartner(data);
    saveAuth(response);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('tvarit_token');
    localStorage.removeItem('tvarit_user');
    setToken(null);
    setUser(null);
  };

  // Switch demo account instantly for presentations & competition judging
  const switchDemoAccount = async (targetRole) => {
    logout();
    if (targetRole === 'ROLE_CUSTOMER') {
      return await loginCustomer('rahul@tvarit.com', 'password123');
    } else if (targetRole === 'ROLE_PARTNER') {
      return await loginPartner('vikram@tvarit.com', 'partner123');
    } else if (targetRole === 'ROLE_ADMIN') {
      return await loginAdmin('admin@tvarit.com', 'admin123');
    }
  };

  const updateUserState = (newFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...newFields };
      localStorage.setItem('tvarit_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        loading,
        loginCustomer,
        loginPartner,
        loginAdmin,
        registerCustomer,
        registerPartner,
        logout,
        switchDemoAccount,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
