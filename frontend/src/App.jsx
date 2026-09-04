import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './layouts/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Customer Pages
import { CustomerHome } from './pages/CustomerHome';
import { CustomerOrderCreate } from './pages/CustomerOrderCreate';
import { CustomerOrderTracking } from './pages/CustomerOrderTracking';
import { CustomerOrdersList } from './pages/CustomerOrdersList';
import { CustomerProfile } from './pages/CustomerProfile';

// Partner Pages
import { PartnerDashboard } from './pages/PartnerDashboard';
import { PartnerShoppingScreen } from './pages/PartnerShoppingScreen';
import { PartnerEarnings } from './pages/PartnerEarnings';
import { PartnerProfile } from './pages/PartnerProfile';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
              <CustomerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/create"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
              <CustomerOrderCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
              <CustomerOrdersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_PARTNER', 'ROLE_ADMIN']}>
              <CustomerOrderTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

        {/* Delivery Partner Routes */}
        <Route
          path="/partner/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_PARTNER', 'ROLE_ADMIN']}>
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partner/orders/:id"
          element={
            <ProtectedRoute allowedRoles={['ROLE_PARTNER', 'ROLE_ADMIN']}>
              <PartnerShoppingScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partner/earnings"
          element={
            <ProtectedRoute allowedRoles={['ROLE_PARTNER', 'ROLE_ADMIN']}>
              <PartnerEarnings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partner/profile"
          element={
            <ProtectedRoute allowedRoles={['ROLE_PARTNER', 'ROLE_ADMIN']}>
              <PartnerProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
