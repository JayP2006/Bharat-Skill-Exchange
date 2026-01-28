import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User,
  Loader2,
  CheckCircle
} from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { workshopService } from '../services/workshopService.js';

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setLoading(true);
        const response = await workshopService.getWorkshopById(id);
        setWorkshop(response.workshop);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load workshop');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      await workshopService.registerWorkshop(id);
      setWorkshop({ ...workshop, isRegistered: true, enrolledCount: (workshop.enrolledCount || 0) + 1 });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading workshop details..." />
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

  if (!workshop) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-app text-center">
            <h1 className="text-2xl font-bold text-foreground">Workshop not found</h1>
            <Link to="/workshops" className="text-primary hover:underline mt-4 inline-block">
              Browse all workshops
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isOwner = user?._id === workshop.instructor?._id;
  const spotsLeft = workshop.capacity - (workshop.enrolledCount || 0);
  const isFull = spotsLeft <= 0;

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-app">
          {/* Back Button */}
          <Link
            to="/workshops"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Workshops
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="card-elevated p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    workshop.isOnline 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {workshop.isOnline ? 'Online' : 'In-Person'}
                  </span>
                  {workshop.isRegistered && (
                    <span className="badge-success flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Registered
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  {workshop.title}
                </h1>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{formatDate(workshop.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{workshop.time} ({workshop.duration || '2 hours'})</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{workshop.location || 'Online'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{workshop.enrolledCount || 0} / {workshop.capacity} spots filled</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card-elevated p-6">
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                  About this Workshop
                </h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {workshop.description}
                </p>

                {workshop.agenda && workshop.agenda.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-foreground mb-3">Agenda</h3>
                    <ul className="space-y-2">
                      {workshop.agenda.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {workshop.requirements && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-foreground mb-3">Requirements</h3>
                    <p className="text-muted-foreground">{workshop.requirements}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructor Card */}
              <div className="card-elevated p-6">
                <h3 className="font-semibold text-foreground mb-4">Host</h3>
                <Link
                  to={`/users/${workshop.instructor?._id}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {workshop.instructor?.avatar ? (
                      <img
                        src={workshop.instructor.avatar}
                        alt={workshop.instructor.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {workshop.instructor?.name || 'Host'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {workshop.instructor?.title || 'Workshop Host'}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Registration Card */}
              {!isOwner && (
                <div className="card-elevated p-6">
                  <div className="text-center mb-4">
                    <p className="text-2xl font-display font-bold text-foreground">
                      {spotsLeft > 0 ? spotsLeft : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">spots remaining</p>
                  </div>

                  {workshop.isRegistered ? (
                    <div className="p-4 bg-success/10 rounded-lg text-center">
                      <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                      <p className="font-medium text-success">You're registered!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check your email for details
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering || isFull}
                      className="w-full btn-gradient py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {registering ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Registering...
                        </>
                      ) : isFull ? (
                        'Workshop Full'
                      ) : (
                        'Register Now'
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkshopDetailPage;
