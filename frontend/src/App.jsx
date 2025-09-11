import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import { useSocket } from '@/hooks/useSocket';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/components/Auth/Login';
import Signup from '@/components/Auth/Signup';
import Profile from '@/pages/Profile';
import SkillSearch from '@/pages/SkillSearch';
import Booking from '@/pages/Booking';
import ChatPage from '@/pages/ChatPage';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';

function App() {
  const { loadUser } = useAuthStore();
  const location = useLocation();

  useSocket(); // Initialize Socket connection
  
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/skills" element={<SkillSearch />} />
            
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/booking/:skillId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/chat/:userId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;