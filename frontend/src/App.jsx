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
import Dashboard from './pages/Dashboard';
import MyWorkshops from './pages/MyWorkshops';
import { ThemeProvider } from './context/themeContext.jsx';
import WorkshopCard from './components/Workshops/WorkshopCard.jsx';
import WorkshopForm from './components/Workshops/WorkshopForm.jsx';
import PageLayout from './components/common/PageLayout';
import EditWorkshopModal from './components/Workshops/EditWorkshopModal.jsx';

function App() {
  const { loadUser } = useAuthStore();
  const location = useLocation();

  useSocket();

  useEffect(() => {
    loadUser();
  }, [loadUser]);
 
     return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        {/* 👈 2. Yahaan se container classes hata dein */}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* === Full-Width Page Route === */}
              {/* Is route par layout apply nahi hoga */}
              <Route path="/" element={<Home />} />

              {/* === Standard Container Page Routes === */}
              {/* Yeh saare routes PageLayout ke andar render honge */}
              <Route element={<PageLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/skills" element={<SkillSearch />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/booking/:skillId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/chat/:userId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/my-workshops" element={<ProtectedRoute><WorkshopCard /></ProtectedRoute>} />
                <Route path="/Add-workshops" element={<ProtectedRoute><WorkshopForm /></ProtectedRoute>} />
                <Route path="/edit-workshop" element={<ProtectedRoute><EditWorkshopModal/></ProtectedRoute>}/>
              </Route>

              {/* NotFound Route (Layout ke bahar rakhein ya andar, aapki choice hai) */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
