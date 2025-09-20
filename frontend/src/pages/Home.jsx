import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Zap, 
  Star, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  Play,
  CheckCircle,
  Globe,
  Heart,
  TrendingUp,
  Target
} from 'lucide-react';

// Custom Hook for Mouse Position
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};

// Floating Orb Component
const FloatingOrb = ({ delay = 0, duration = 20, size = "w-32 h-32", className = "" }) => (
  <motion.div
    className={`absolute rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl ${size} ${className}`}
    animate={{
      x: [0, 100, 0, -100, 0],
      y: [0, -100, 0, 100, 0],
      scale: [1, 1.2, 1, 0.8, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const FloatingElement = ({ children, delay = 0 }) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, 0, -5, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      let startTime;
      let animationFrame;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

// Hero Video Background Component
const HeroVideoBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
      animate={{
        background: [
          "linear-gradient(45deg, hsl(var(--primary)/0.05), transparent, hsl(var(--accent)/0.05))",
          "linear-gradient(135deg, hsl(var(--accent)/0.05), transparent, hsl(var(--primary)/0.05))",
          "linear-gradient(225deg, hsl(var(--primary)/0.05), transparent, hsl(var(--accent)/0.05))",
          "linear-gradient(315deg, hsl(var(--accent)/0.05), transparent, hsl(var(--primary)/0.05))",
        ]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
    
    {/* Floating Elements */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-primary/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [-20, -100, -20],
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Floating orbs */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full ${
          i % 3 === 0 ? 'bg-primary/5' : i % 3 === 1 ? 'bg-accent/5' : 'bg-secondary/5'
        }`}
        style={{
          width: `${60 + i * 20}px`,
          height: `${60 + i * 20}px`,
          left: `${10 + i * 15}%`,
          top: `${20 + i * 10}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "easeInOut"
        }}
      />
    ))}
    
    {/* Gradient overlays */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
      animate={{
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </div>
);

// Advanced Feature Card
const AdvancedFeatureCard = ({ icon, title, description, index, stats }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: { 
          duration: 0.6, 
          delay: index * 0.2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      } : {}}
      whileHover={{ 
        y: -10, 
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      className="group relative overflow-hidden"
    >
      <motion.div 
        className="relative p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500"
        whileHover={{
          background: "linear-gradient(135deg, hsl(var(--card)/0.9), hsl(var(--primary)/0.05))"
        }}
      >
        {/* Hover Glow Effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
        />
        
        {/* Icon with advanced animations */}
        <motion.div 
          className="relative mb-6"
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-lg">
            {icon}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-30"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
        
        <motion.h3 
          className="text-xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
          layoutId={`title-${index}`}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-muted-foreground mb-4 leading-relaxed"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {description}
        </motion.p>
        
        {/* Stats */}
        <motion.div 
          className="flex items-center gap-4 text-sm"
          initial={{ y: 10, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: index * 0.2 + 0.3 }}
        >
          <span className="flex items-center gap-1 text-primary font-semibold">
            <Star className="w-4 h-4 fill-current" />
            {stats}
          </span>
          <motion.span 
            className="text-muted-foreground"
            whileHover={{ x: 5 }}
          >
            Learn More <ArrowRight className="w-3 h-3 inline ml-1" />
          </motion.span>
        </motion.div>
        
        {/* Particle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, children, index }) => (
  <motion.div 
    className="relative p-8 bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 backdrop-blur-sm overflow-hidden"
    initial={{ opacity: 0, y: 60, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.6, 
      delay: index * 0.2,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{ 
      y: -10, 
      scale: 1.02,
      boxShadow: "0 25px 50px rgba(0,0,0, 0.1)",
      transition: { duration: 0.3 }
    }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Card background glow */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl"
      whileHover={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
    
    <div className="relative z-10 text-center">
      <motion.div 
        className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-foreground text-primary-foreground mb-6 shadow-lg"
        whileHover={{ 
          rotate: 360,
          scale: 1.1,
        }}
        transition={{ 
          rotate: { duration: 0.6 },
          scale: { duration: 0.2 }
        }}
      >
        {icon}
      </motion.div>
      
      <motion.h3 
        className="text-xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {title}
      </motion.h3>
      
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </div>
    
    {/* Sparkle effect on hover */}
    <motion.div
      className="absolute top-4 right-4 text-primary/30"
      whileHover={{ 
        rotate: 180,
        scale: 1.2,
        color: "hsl(var(--primary))"
      }}
      transition={{ duration: 0.3 }}
    >
      <Sparkles className="w-5 h-5" />
    </motion.div>
  </motion.div>
);

const AnimatedButton = ({ children, onClick, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-lg blur-lg opacity-30"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <Button 
      size="lg" 
      onClick={onClick}
      className={`relative z-10 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-xl border-0 ${className}`}
    >
      {children}
    </Button>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const mousePosition = useMousePosition();
  const { scrollY } = useScroll();
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 1000], [0, -200]);
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);

  // Stats data
  const stats = [
    { label: "Active Gurus", value: 2769, suffix: "+" },
    { label: "Skills Taught", value: 300, suffix: "+" },
    { label: "Sessions Completed", value: 2500, suffix: "+" },
    { label: "Cities Covered", value: 300, suffix: "+" }
  ];

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Gurus",
      description: "Connect with verified local experts across 500+ skills. From traditional crafts to modern technology.",
      stats: "4.9/5"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Flexible Learning",
      description: "Learn at your pace with 1-on-1 sessions, group workshops, or online masterclasses.",
      stats: "25k+ sessions"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Get Certified",
      description: "Earn verified certificates and showcase your new skills to potential employers.",
      stats: "15k+ certified"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Graphic Designer",
      content: "Found an amazing pottery guru in my neighborhood. The experience was transformative!",
      avatar: "PS"
    },
    {
      name: "Rahul Gupta",
      role: "Software Engineer",
      content: "Learning guitar from a local maestro has been the highlight of my year.",
      avatar: "RG"
    },
    {
      name: "Anjali Patel",
      role: "Marketing Manager",
      content: "The cooking classes helped me connect with my cultural roots. Highly recommended!",
      avatar: "AP"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingOrb delay={0} duration={25} className="top-10 left-10" />
        <FloatingOrb delay={5} duration={30} className="top-32 right-20 w-24 h-24" />
        <FloatingOrb delay={10} duration={35} className="bottom-20 left-32 w-40 h-40" />
        <FloatingOrb delay={15} duration={28} className="bottom-32 right-10 w-20 h-20" />
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY }}
      >
        <HeroVideoBackground />
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
          style={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02
          }}
        >
          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>India's #1 Skill Exchange Platform</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Main Heading with Advanced Typography */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.span 
              className="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 100%" }}
            >
              Learn from
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 100%" }}
            >
              Local Gurus
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover extraordinary skills in your neighborhood. Connect with verified local experts and transform your learning journey.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/25 group"
                onClick={() => navigate('/signup')}
              >
                Start Learning Today
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
            
            <motion.button
              className="flex items-center gap-3 px-6 py-3 rounded-lg text-foreground hover:bg-accent/50 transition-colors group"
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Play className="w-5 h-5 text-primary ml-0.5" />
              </motion.div>
              <span className="font-medium">Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="group"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-primary mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </motion.div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-primary rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="relative py-32 px-4"
        style={{ y: backgroundY }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
              layoutId="section-title"
            >
              Why Choose SkillBharat?
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Experience learning like never before with our community-driven approach
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <AdvancedFeatureCard
                key={index}
                {...feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section className="relative py-32 px-4 bg-gradient-to-br from-card/50 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl font-bold mb-4">What Our Community Says</h3>
            <p className="text-xl text-muted-foreground">Real stories from real learners</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  rotateY: 0,
                  transition: { delay: index * 0.2 }
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section className="relative py-32 px-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-5xl font-bold mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Ready to Start Your Journey?
            </h3>
            <p className="text-xl text-muted-foreground mb-12">
              Join thousands of learners discovering new skills every day
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/25 group relative overflow-hidden"
                onClick={() => navigate('/signup')}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative z-10">Get Started Now</span>
                <motion.div
                  className="relative z-10 ml-3"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="w-6 h-6" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
