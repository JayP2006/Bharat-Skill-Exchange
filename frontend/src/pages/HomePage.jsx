import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Lightbulb, 
  Users, 
  Award, 
  MessageSquare, 
  Star,
  CheckCircle,
  Zap,
  BookOpen,
  Globe
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import SkillCard from '../components/skills/SkillCard.jsx';
import { skillService } from '../services/skillService.js';

const HomePage = () => {
  const [featuredSkills, setFeaturedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillService.getAllSkills({ limit: 6 });
        setFeaturedSkills(response.skills || []);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const features = [
    {
      icon: Lightbulb,
      title: 'Share Your Skills',
      description: 'Turn your expertise into opportunities. Teach what you know and help others grow.',
    },
    {
      icon: BookOpen,
      title: 'Learn Anything',
      description: 'Access a diverse range of skills from passionate instructors in our community.',
    },
    {
      icon: MessageSquare,
      title: 'Connect & Chat',
      description: 'Direct messaging with instructors to discuss your learning goals.',
    },
    {
      icon: Award,
      title: 'Earn Certificates',
      description: 'Get recognized for your achievements with verified completion certificates.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Learners' },
    { value: '2.5K+', label: 'Skills Offered' },
    { value: '500+', label: 'Expert Instructors' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container-app relative py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <Zap className="w-4 h-4" />
              <span>The Future of Peer Learning</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight animate-slide-up">
              Learn & Teach{' '}
              <span className="gradient-text">Skills</span>
              {' '}Together
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Join a vibrant community where knowledge flows freely. Exchange skills, 
              connect with experts, and grow together in the ultimate peer-to-peer learning platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/register"
                className="btn-gradient px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/skills"
                className="px-8 py-4 rounded-xl text-lg font-semibold bg-secondary text-foreground hover:bg-secondary/80 transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Browse Skills
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-card/50">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Everything You Need to{' '}
              <span className="gradient-text">Learn & Grow</span>
            </h2>
            <p className="text-muted-foreground mt-4">
              Our platform provides all the tools you need for an amazing skill-sharing experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-elevated p-6 text-center group hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-app">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Featured Skills
              </h2>
              <p className="text-muted-foreground mt-2">
                Discover popular skills from our community
              </p>
            </div>
            <Link
              to="/skills"
              className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-200"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-elevated h-80 animate-pulse">
                  <div className="h-48 bg-secondary rounded-t-xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-full" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredSkills.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSkills.map((skill) => (
                <SkillCard key={skill._id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No skills available yet. Be the first to share!</p>
            </div>
          )}

          <div className="md:hidden mt-8 text-center">
            <Link
              to="/skills"
              className="inline-flex items-center gap-2 text-primary font-medium"
            >
              View All Skills
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              How <span className="gradient-text">SkillSwap</span> Works
            </h2>
            <p className="text-muted-foreground mt-4">
              Get started in minutes and begin your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up and showcase your skills or what you want to learn.',
              },
              {
                step: '02',
                title: 'Find Perfect Matches',
                description: 'Browse skills and connect with instructors that match your goals.',
              },
              {
                step: '03',
                title: 'Start Learning',
                description: 'Book sessions, attend workshops, and grow your skillset.',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-7xl font-display font-bold text-primary/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-10">
                  <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
            
            <div className="relative max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-primary-foreground/80 mt-4 text-lg">
                Join thousands of learners and instructors already sharing knowledge on SkillSwap.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-xl bg-background text-foreground font-semibold hover:bg-background/90 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/skills"
                  className="px-8 py-4 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Explore Skills
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
