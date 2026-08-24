import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import LandingPage from './pages/LandingPage';
import CanteenMenuPage from './pages/CanteenMenuPage';
import JoinQueuePage from './pages/JoinQueuePage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white dark:selection:text-slate-950 transition-colors duration-200">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/canteens" element={<LandingPage />} />
                  <Route path="/menu" element={<CanteenMenuPage />} />
                  <Route path="/join" element={<JoinQueuePage />} />
                  <Route path="/order/:orderId" element={<UserDashboardPage />} />
                  <Route path="/queue/:tokenNumber" element={<UserDashboardPage />} />
                  <Route path="/service/:serviceId" element={<CanteenMenuPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/analytics" element={<AnalyticsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <CartDrawer />
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
