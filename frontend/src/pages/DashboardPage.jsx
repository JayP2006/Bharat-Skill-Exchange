import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Lightbulb,
  Users,
  Award,
  ExternalLink,
  Link as LinkIcon,
  Pencil,
  MessageSquare,
  Star,
  CheckCircle
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ReviewForm from '../components/reviews/ReviewForm'; // ✅ Import Review Form
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { skillService } from '../services/skillService';
import { userService } from '../services/userService';
import { certificateService } from '../services/certificateService'; // ✅ Import Cert Service
import api from '../config/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Meeting link states
  const [meetingLink, setMeetingLink] = useState('');
  const [savingLink, setSavingLink] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const isGuru = user?.role === 'Guru';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingPromise = isGuru
          ? bookingService.getBookingRequests()
          : bookingService.getMyBookings();

        const promises = [
          userService.getUserStats().catch(() => ({})),
          bookingPromise.catch(() => ({ bookings: [] })),
        ];

        if (isGuru) {
          promises.push(
            skillService.getMySkills().catch(() => ({ skills: [] }))
          );
        }

        const [statsData, bookingsData, skillsData] = await Promise.all(promises);

        setStats(statsData);

        const bookingList =
          bookingsData.bookings ||
          (Array.isArray(bookingsData) ? bookingsData : []);
        setBookings(bookingList);

        if (skillsData) {
          setMySkills(skillsData.skills || []);
        }
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isGuru]);

  // 🔥 CALCULATE COMPLETED SESSIONS COUNT
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;

  // UPCOMING SESSION
  const upcomingSession = [...bookings]
    .filter(
      (b) =>
        b.status === 'SCHEDULED' &&
        b.scheduledAt &&
        new Date(b.scheduledAt) > new Date()
    )
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];

  useEffect(() => {
    if (upcomingSession?.meetingLink) {
      setMeetingLink(upcomingSession.meetingLink);
      setEditMode(false);
    }
  }, [upcomingSession]);

  // RECENT BOOKINGS
  const recentBookings = isGuru
    ? bookings.filter((b) =>
        ['REQUESTED', 'ACCEPTED', 'SCHEDULED', 'COMPLETED'].includes(b.status)
      )
    : [...bookings].sort((a, b) => {
        if (a.status === 'SCHEDULED') return -1;
        if (b.status === 'SCHEDULED') return 1;
        return 0;
      });

  // STATUS BADGE
  const getStatusBadge = (status) => {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';
    const map = {
      REQUESTED: {
        className: `${base} bg-yellow-100 text-yellow-700 border border-yellow-200`,
        label: 'Pending',
      },
      ACCEPTED: {
        className: `${base} bg-blue-100 text-blue-700 border border-blue-200`,
        label: 'Accepted',
      },
      SCHEDULED: {
        className: `${base} bg-emerald-100 text-emerald-700 border border-emerald-200`,
        label: 'Scheduled',
      },
      COMPLETED: {
        className: `${base} bg-green-600 text-white`,
        label: 'Completed',
      },
      CANCELLED: {
        className: `${base} bg-red-100 text-red-700 border border-red-200`,
        label: 'Cancelled',
      },
    };
    return map[status] || map.REQUESTED;
  };

  // SAVE MEETING LINK
  const saveMeetingLink = async (bookingId) => {
    if (!meetingLink) return;
    try {
      setSavingLink(true);
      await api.put(`/sessions/${bookingId}`, { meetingLink });

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, meetingLink } : b))
      );

      setEditMode(false);
    } catch (err) {
      console.error('Failed to save meeting link', err);
    } finally {
      setSavingLink(false);
    }
  };

  const canJoinSession = (session) => {
    if (!session?.meetingLink || !session?.scheduledAt) return false;
    const sessionTime = new Date(session.scheduledAt).getTime();
    const now = Date.now();
    return now >= sessionTime - 10 * 60 * 1000;
  };

  // 🔥 NEW: ISSUE CERTIFICATE HANDLER (For Gurus)
  const handleIssueCertificate = async (bookingId, learnerName) => {
    if (!window.confirm(`Issue certificate to ${learnerName}?`)) return;
    try {
      await certificateService.issueCertificate({ bookingId });
      alert('Certificate Issued Successfully! 🎉');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to issue certificate');
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading dashboard..." />
      </Layout>
    );
  }

  // --- STAT CARDS CONFIGURATION ---
  let statCards = [];

  if (isGuru) {
    statCards.push({
      icon: Lightbulb,
      label: 'Skills Created',
      value: mySkills.length,
      color: 'text-primary',
    });
  }

  statCards.push({
    icon: Calendar,
    label: isGuru ? 'Booking Requests' : 'My Bookings',
    value: bookings.length,
    color: 'text-accent',
  });

  statCards.push({
    icon: Users,
    label: 'Sessions Completed',
    value: completedCount,
    color: 'text-success',
  });

  if (!isGuru) {
    statCards.push({
      icon: Award,
      label: 'Certificates Earned',
      value: stats?.certificates || 0,
      color: 'text-warning',
    });
  }

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-app">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening with your learning journey
            </p>
          </div>

          {/* STATS SECTION */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, i) => (
              <div key={i} className="card-elevated p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* UPCOMING SESSION CARD */}
          {upcomingSession && (
            <div className="card-elevated p-6 mb-8 border border-emerald-200 bg-emerald-50/40">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Upcoming Session</p>
                  <h3 className="text-lg font-bold mt-1">{upcomingSession.skill?.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isGuru
                      ? `Learner: ${upcomingSession.learner?.name}`
                      : `Guru: ${upcomingSession.guru?.name}`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    📅 {new Date(upcomingSession.scheduledAt).toLocaleString()}
                  </p>
                  {canJoinSession(upcomingSession) && (
                    <button
                      onClick={() => window.open(upcomingSession.meetingLink, '_blank')}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Join Session
                    </button>
                  )}
                </div>

                {isGuru && (
                  <div className="w-full max-w-xs">
                    {!upcomingSession.meetingLink || editMode ? (
                      <>
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                          <LinkIcon className="w-4 h-4" />
                          Meeting Link
                        </div>
                        <input
                          type="text"
                          placeholder="Paste Zoom / Meet link"
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                          className="input-styled w-full mb-2"
                        />
                        <button
                          onClick={() => saveMeetingLink(upcomingSession._id)}
                          disabled={savingLink}
                          className="btn-gradient w-full py-2 text-sm rounded-lg"
                        >
                          {savingLink ? 'Saving...' : 'Save Link'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:underline"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit meeting link
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GURU SKILLS SECTION */}
          {isGuru && (
            <div className="card-elevated p-6 mb-8">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">My Skills</h2>
                <Link to="/dashboard/skills/create" className="flex items-center gap-2 text-primary">
                  <Plus className="w-4 h-4" />
                  Add Skill
                </Link>
              </div>
              {mySkills.slice(0, 5).map((skill) => (
                <Link
                  key={skill._id}
                  to={`/skills/${skill._id}`}
                  className="flex justify-between p-3 rounded-lg bg-secondary/50 mb-2"
                >
                  <p>{skill.title}</p>
                  <span className="badge-primary">{skill.level}</span>
                </Link>
              ))}
            </div>
          )}

          {/* RECENT BOOKINGS TABLE */}
          <div className="card-elevated p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {isGuru ? 'Recent Booking Requests' : 'My Bookings'}
              </h2>
              <Link to="/dashboard/bookings" className="text-primary text-sm">
                View All
              </Link>
            </div>
            {recentBookings.slice(0, 10).map((b) => {
              const badge = getStatusBadge(b.status);
              const otherUser = isGuru ? b.learner : b.guru;
              
              return (
                <div key={b._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-secondary/50 mb-2 gap-3">
                  <div>
                    <p className="font-medium">{b.skill?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : 'Not scheduled yet'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isGuru ? `With: ${b.learner?.name}` : `Guru: ${b.guru?.name}`}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={badge.className}>{badge.label}</span>
                    
                    {/* 🔥 ACTIONS FOR COMPLETED SESSIONS */}
                    {b.status === 'COMPLETED' && (
                      <div className="flex items-center gap-2 ml-2 border-l pl-2 border-border/50">
                        
                        {/* 1. Guru Action: Issue Certificate */}
                        {isGuru && (
                          <button
                            onClick={() => handleIssueCertificate(b._id, b.learner?.name)}
                            title="Issue Certificate"
                            className="p-1.5 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                        )}

                        {/* 2. Learner Action: Write Review */}
                        {!isGuru && (
                          <button
                            onClick={() => {
                              setSelectedBookingForReview(b);
                              setShowReviewModal(true);
                            }}
                            title="Write a Review"
                            className="p-1.5 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* 3. Common Action: Message */}
                    {otherUser?._id && (
                       <button
                         onClick={() => navigate(`/messages?user=${otherUser._id}`)}
                         title="Message"
                         className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors ml-1"
                       >
                         <MessageSquare className="w-4 h-4" />
                       </button>
                    )}
                  </div>
                </div>
              );
            })}
            {recentBookings.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No bookings found.</p>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 REVIEW MODAL (ONLY FOR LEARNERS) */}
      {showReviewModal && selectedBookingForReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-background rounded-xl p-6 w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Rate your session</h2>
            <p className="text-sm text-muted-foreground mb-4">
              How was your session on <b>{selectedBookingForReview.skill?.title}</b>?
            </p>
            
            <ReviewForm 
              bookingId={selectedBookingForReview._id} 
              onSuccess={() => {
                 setShowReviewModal(false);
                 alert('Review submitted successfully!');
              }}
            />
          </div>
        </div>
      )}

    </Layout>
  );
};

export default DashboardPage;