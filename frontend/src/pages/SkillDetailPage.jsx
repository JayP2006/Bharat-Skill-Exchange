import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Users, 
  Calendar, 
  MessageSquare, 
  User,
  CheckCircle,
  Loader2
} from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import ReviewCard from '../components/reviews/ReviewCardd.jsx';
import ReviewForm from '../components/reviews/ReviewForm.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { skillService } from '../services/skillService.js';
import { bookingService } from '../services/bookingService.js';
import { reviewService } from '../services/reviewService.js';

const SkillDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [skill, setSkill] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [booking, setBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchData(); // First load (with spinner)
  }, [id]);

  // 🔥 UPDATE: Added 'isBackground' parameter for silent refresh
  const fetchData = async (isBackground = false) => {
    try {
      // Agar background refresh hai, to Loading Spinner mat dikhao
      if (!isBackground) setLoading(true);
      
      const [skillData, reviewsData] = await Promise.all([
        skillService.getSkillById(id), // 👈 New Rating yahan se aayegi
        reviewService.getSkillReviews(id).catch(() => []), 
      ]);

      setSkill(skillData.skill);

      // Handle Array vs Object response
      const reviewsList = Array.isArray(reviewsData) ? reviewsData : (reviewsData.reviews || []);
      setReviews(reviewsList);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load skill');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setBooking(true);
      await bookingService.createBooking({
        skillId: id,
        date: bookingDate,
        time: bookingTime,
        message: bookingMessage,
      });
      alert('Booking request sent successfully!');
      setBookingDate('');
      setBookingTime('');
      setBookingMessage('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading skill details..." />
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

  if (!skill) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-app text-center">
            <h1 className="text-2xl font-bold text-foreground">Skill not found</h1>
            <Link to="/skills" className="text-primary hover:underline mt-4 inline-block">
              Browse all skills
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isOwner = user?._id === skill.instructor?._id;
  const isGuru = user?.role === 'Guru'; 

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-app">
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Skills
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="card-elevated p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="badge-primary">{skill.category}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    skill.level === 'Beginner' ? 'badge-success' :
                    skill.level === 'Intermediate' ? 'badge-warning' : 'badge-primary'
                  }`}>
                    {skill.level}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  {skill.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="font-medium text-foreground">
                      {/* 🔥 REALTIME RATING DISPLAY */}
                      {skill.rating?.toFixed(1) || '0.0'}
                    </span>
                    <span>({reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{skill.duration || '1 hour'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{skill.enrolledCount || 0} enrolled</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card-elevated p-6">
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                  About this Skill
                </h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {skill.description}
                </p>

                {skill.topics && skill.topics.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-foreground mb-3">What you'll learn</h3>
                    <ul className="space-y-2">
                      {skill.topics.map((topic, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold text-foreground">
                    Reviews ({reviews.length})
                  </h2>
                  {isAuthenticated && !isOwner && !isGuru && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="text-primary font-medium text-sm hover:underline"
                    >
                      {showReviewForm ? 'Cancel' : 'Write a Review'}
                    </button>
                  )}
                </div>

                {showReviewForm && (
          <div className="mb-6 p-4 bg-secondary/50 rounded-lg">
            <ReviewForm 
              bookingId={id} 
              onSuccess={(responseData) => {
                setShowReviewForm(false);
                
                // 🔥 REALTIME MAGIC START 🔥
                
                // 1. Naya Review List mein Add karo (Sabse upar)
                // Hum responseData.review use kar rahe hain jo backend ne bheja
                if (responseData.review) {
                    setReviews(prevReviews => [responseData.review, ...prevReviews]);
                }

                // 2. Rating ko Screen par Turant Update karo
                // Hum responseData.newRating use kar rahe hain
                if (responseData.newRating) {
                    setSkill(prevSkill => ({
                        ...prevSkill,
                        rating: responseData.newRating // 👈 Rating number update
                    }));
                }

                // 🔥 REALTIME MAGIC END 🔥
              }}
            />
          </div>
      )}

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-elevated p-6">
                <h3 className="font-semibold text-foreground mb-4">Instructor</h3>
                
                <Link
                  to={`/users/${skill.instructor?._id}`}
                  className="flex items-center gap-4 group cursor-pointer hover:bg-secondary/50 p-2 -m-2 rounded-lg transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {skill.instructor?.avatar ? (
                      <img
                        src={skill.instructor.avatar}
                        alt={skill.instructor.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {skill.instructor?.name || 'Instructor'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {skill.instructor?.title || 'Expert Instructor'}
                    </p>
                  </div>
                </Link>

                {isAuthenticated && !isOwner && (
                  <Link
                    to={`/messages?user=${skill.instructor?._id}`}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Link>
                )}
              </div>

              {!isOwner && !isGuru && (
                <div className="card-elevated p-6">
                  <h3 className="font-semibold text-foreground mb-4">Book a Session</h3>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full input-styled px-4 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full input-styled px-4 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message (optional)
                      </label>
                      <textarea
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                        placeholder="Introduce yourself or ask questions..."
                        rows={3}
                        className="w-full input-styled px-4 py-2"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={booking}
                      className="w-full btn-gradient py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {booking ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        'Request Booking'
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SkillDetailPage;