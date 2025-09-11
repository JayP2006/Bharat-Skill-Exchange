import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Zap } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const FeatureCard = ({ icon, title, children }) => (
  <motion.div 
    className="p-6 bg-card rounded-xl border text-center"
    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0, 0.05)" }}
  >
    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{children}</p>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="space-y-20"
    >
      <section className="text-center pt-16 pb-12 sm:pt-24 sm:pb-20">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4" 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          Discover & Share Skills, <span className="text-primary">Bharat</span> Style.
        </motion.h1>
        <motion.p 
          className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8" 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Connect with local Gurus, learn new talents, and share your expertise. Your hyperlocal peer-to-peer skill exchange platform.
        </motion.p>
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button size="lg" onClick={() => navigate(user ? '/skills' : '/signup')}>
            {user ? 'Find Your Guru' : 'Get Started Now'}
            <Zap className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      <section className="pb-16 sm:pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<Users className="w-6 h-6"/>} title="Find Your Guru">Search for skilled individuals in your locality. From coding to cooking, find the perfect mentor.</FeatureCard>
          <FeatureCard icon={<BookOpen className="w-6 h-6"/>} title="Book a Session">Easily book one-on-one sessions or workshops. Secure payments and flexible scheduling.</FeatureCard>
          <FeatureCard icon={<Zap className="w-6 h-6"/>} title="Learn & Grow">Connect via live video calls or in-person. Gain new skills, get certified, and grow your potential.</FeatureCard>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;