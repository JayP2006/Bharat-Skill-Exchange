import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Mail, MapPin, Briefcase, Star, MessageSquare } from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import SkillCard from '../components/skills/SkillItem.jsx';
import ReviewCard from '../components/reviews/ReviewCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { userService } from '../services/userService.js';
import { skillService } from '../services/skillService.js';
import { reviewService } from '../services/reviewService.js';

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('skills');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, skillsData, reviewsData] = await Promise.all([
          userService.getUserById(id),
          skillService.getAllSkills({ instructor: id }).catch(() => ({ skills: [] })),
          reviewService.getUserReviews(id).catch(() => ({ reviews: [] })),
        ]);
        setProfile(userData.user);
        setSkills(skillsData.skills || []);
        setReviews(reviewsData.reviews || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading profile..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-app">
            <ErrorMessage message={error} onRetry={() => window.location.reload()} />
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-app text-center">
            <h1 className="text-2xl font-bold text-foreground">User not found</h1>
          </div>
        </div>
      </Layout>
    );
  }

  const isOwnProfile = currentUser?._id === id;

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-app">
          {/* Profile Header */}
          <div className="card-elevated p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 avatar-ring">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-display font-bold text-primary">
                    {profile.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                      {profile.name}
                    </h1>
                    {profile.title && (
                      <p className="text-muted-foreground mt-1">{profile.title}</p>
                    )}
                  </div>

                  {isAuthenticated && !isOwnProfile && (
                    <Link
                      to={`/messages?user=${id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="capitalize">{profile.role || 'Member'}</span>
                  </div>
                  {profile.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span>{profile.rating.toFixed(1)} ({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <p className="mt-4 text-muted-foreground">{profile.bio}</p>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="badge-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-3 font-medium transition-colors relative ${
                activeTab === 'skills'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Skills ({skills.length})
              {activeTab === 'skills' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-3 font-medium transition-colors relative ${
                activeTab === 'reviews'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Reviews ({reviews.length})
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>

          {/* Content */}
          {activeTab === 'skills' ? (
            skills.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                  <SkillCard key={skill._id} skill={skill} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No skills yet</p>
              </div>
            )
          ) : (
            reviews.length > 0 ? (
              <div className="space-y-4 max-w-2xl">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
