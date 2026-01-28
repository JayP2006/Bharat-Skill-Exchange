import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Mail, MapPin, Briefcase, Edit2, Save, X, Loader2, 
  Clock, Plus, Trash2, Calendar, Users, MessageSquare 
} from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { userService } from '../services/userService.js';
import { reviewService } from '../services/reviewService.js';
import ReviewCard from '../components/reviews/ReviewCardd.jsx';
import api from '../config/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProfilePage = () => {
  const { id } = useParams(); // URL se ID (Visitor ke liye)
  const { user, updateProfile } = useAuth(); // Logged-in user
  
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  // Availability States
  const [availability, setAvailability] = useState([]); 
  const [maxStudents, setMaxStudents] = useState(1);
  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form Data for Edit Mode
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    title: '',
    skills: '',
    coordinates: null,
  });

  // 1. Is this MY profile? (True if no ID in URL OR ID matches logged-in user)
  const isOwnProfile = !id || (user && user._id === id);

  // 2. Is the profile being viewed a Guru?
  const isGuruProfile = profile?.role?.toLowerCase() === 'guru';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const targetUserId = id || user?._id;
        if (!targetUserId) return; 

        // --- Fetch Data ---
        let profileData;
        if (id) {
            profileData = await userService.getUserById(id); // Public fetch
        } else {
            profileData = await userService.getProfile(); // Private fetch
        }

        const [reviewsData, availabilityData] = await Promise.all([
          reviewService.getUserReviews(targetUserId).catch(() => ({ reviews: [] })),
          api.get(`/availability/${targetUserId}`).catch(() => ({ data: { availability: null } }))
        ]);

        const userData = profileData.user;
        setProfile(userData);
        setReviews(reviewsData.reviews || []);
        
        const availData = availabilityData.data?.availability;
        setAvailability(availData?.slots || []);
        setMaxStudents(availData?.maxStudents || 1); 

        // --- Prepare Data for Form & Display ---
        // 1. Safe Location Text
        let displayLocation = '';
        if (userData?.locationText) {
            displayLocation = userData.locationText;
        } else if (typeof userData?.location === 'string') {
            displayLocation = userData.location;
        }

        // 2. Safe Skills String
        let displaySkills = '';
        if (Array.isArray(userData?.skills)) {
            displaySkills = userData.skills.join(', ');
        } else if (Array.isArray(userData?.skillsOffered)) {
            displaySkills = userData.skillsOffered.map(s => s.skillName).join(', ');
        }

        setFormData({
          name: userData?.name || '',
          email: userData?.email || '',
          bio: userData?.bio || '',
          location: displayLocation,
          title: userData?.title || userData?.headline || '', 
          skills: displaySkills,
          coordinates: userData?.location?.coordinates || null
        });

      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user?._id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Availability Handlers (Only for Edit Mode) ---
  const handleAddSlot = () => {
    setAvailability([...availability, { day: 'Mon', from: '09:00', to: '17:00' }]);
  };

  const handleRemoveSlot = (index) => {
    const newSlots = availability.filter((_, i) => i !== index);
    setAvailability(newSlots);
  };

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...availability];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setAvailability(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwnProfile) return;

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        coordinates: formData.coordinates, 
        locationText: formData.location, 
        headline: formData.title 
      };

      const profileResult = await updateProfile(updateData);

      if (isGuruProfile) {
        await api.post('/availability', { 
          slots: availability,
          maxStudents: parseInt(maxStudents) 
        });
      }

      if (profileResult.success) {
        setProfile({ ...profile, ...profileResult.user }); 
        setEditing(false);
      } else {
        alert(profileResult.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update profile details');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await userService.updateAvatar(formData);
      if (res.success) setProfile(res.user);
    } catch {
      alert('Failed to upload image');
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if(isOwnProfile) {
            await updateProfile({
                coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude },
            });
        }
      },
      () => alert('Location permission denied')
    );
  };

  // Helper to safely render location text
  const renderLocationText = () => {
    if (profile?.locationText) return profile.locationText;
    if (typeof profile?.location === 'string') return profile.location;
    if (profile?.location && typeof profile.location === 'object') return "Location available";
    return "No location set";
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading profile..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-app max-w-4xl mx-auto px-4 sm:px-6">
          
          <form onSubmit={handleSubmit}>
            
            {/* --- SECTION 1: PROFILE INFO --- */}
            <div className="card-elevated p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                
                {/* Avatar */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 avatar-ring overflow-hidden shadow-md">
                    {profile?.avatar && profile.avatar !== 'default_avatar_url' ? (
                      <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-4xl font-display font-bold text-primary">
                        {profile?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  {editing && isOwnProfile && (
                    <label className="mt-3 inline-block text-sm text-primary cursor-pointer hover:underline font-medium">
                      Change photo
                      <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                    </label>
                  )}
                </div>

                {/* Info Content */}
                <div className="flex-1 w-full">
                  {editing ? (
                    // --- EDIT MODE (Only Owner) ---
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full input-styled px-4 py-2" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full input-styled px-4 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                          <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full input-styled px-4 py-2" />
                          <button type="button" onClick={handleUseCurrentLocation} className="mt-1 text-xs text-primary hover:underline flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Use current location
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Skills</label>
                          <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full input-styled px-4 py-2" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full input-styled px-4 py-2" />
                      </div>
                    </div>
                  ) : (
                    // --- VIEW MODE (For Everyone: Visitor & Owner) ---
                    <div className="text-center md:text-left">
                      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                        <div>
                          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                            {profile?.name}
                          </h1>
                          {(profile?.title || profile?.headline) && (
                            <p className="text-muted-foreground mt-1 text-base sm:text-lg">
                                {profile.title || profile.headline}
                            </p>
                          )}
                        </div>
                        
                        {/* Buttons */}
                        <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
                            {isOwnProfile ? (
                                <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors">
                                  <Edit2 className="w-4 h-4" /> Edit Profile
                                </button>
                            ) : (
                                <Link to={`/messages?user=${profile?._id}`} className="flex items-center gap-2 px-4 py-2 rounded-lg btn-gradient font-medium shadow-lg shadow-primary/25">
                                  <MessageSquare className="w-4 h-4" /> Message
                                </Link>
                            )}
                        </div>
                      </div>

                      {/* Detail Row */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-md">
                          <Mail className="w-4 h-4" />
                          <span className="truncate max-w-[150px] sm:max-w-none">{profile?.email}</span>
                        </div>
                        
                        {(profile?.location || profile?.locationText) && (
                          <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-md">
                            <MapPin className="w-4 h-4" />
                            <span>{renderLocationText()}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-md">
                          <Briefcase className="w-4 h-4" />
                          <span className="capitalize">{profile?.role || 'Learner'}</span>
                        </div>
                      </div>

                      {/* Bio */}
                      {profile?.bio && (
                        <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-border/50 text-left">
                            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base whitespace-pre-line">{profile.bio}</p>
                        </div>
                      )}

                      {/* Skills Badges */}
                      {(profile?.skills?.length > 0 || profile?.skillsOffered?.length > 0) && (
                        <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
                          {profile.skills && profile.skills.map((skill, index) => (
                            <span key={`s-${index}`} className="badge-primary px-3 py-1 text-xs sm:text-sm">{skill}</span>
                          ))}
                          {profile.skillsOffered && profile.skillsOffered.map((s, index) => (
                             <span key={`so-${index}`} className="badge-primary px-3 py-1 text-xs sm:text-sm">{s.skillName}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- SECTION 2: AVAILABILITY (Visible if user is Guru) --- */}
            {isGuruProfile && (
              <div className="card-elevated p-5 sm:p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Availability Schedule
                    </h2>
                    {/* Visitor ko capacity dikhegi */}
                    {!editing && availability.length > 0 && (
                       <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                         Capacity: {maxStudents} / session
                       </span>
                    )}
                  </div>
                  
                  {/* Add Slot Button (Only for Owner + Edit Mode) */}
                  {editing && isOwnProfile && (
                    <button type="button" onClick={handleAddSlot} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm">
                      <Plus className="w-4 h-4" /> Add Slot
                    </button>
                  )}
                </div>

                {/* --- Logic: If Editing (Owner) -> Show Inputs. Else -> Show Grid --- */}
                {editing && isOwnProfile ? (
                  // EDIT MODE (Inputs)
                  <div className="space-y-6">
                    <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                      <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" /> Max Students per Session
                      </label>
                      <input type="number" min="1" max="50" value={maxStudents} onChange={(e) => setMaxStudents(e.target.value)} className="w-full sm:w-32 input-styled px-4 py-2" />
                    </div>
                    <div className="space-y-3">
                      {availability.map((slot, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-4 bg-secondary/30 rounded-xl border border-border">
                          <div className="w-full sm:w-32 flex-shrink-0">
                             <select value={slot.day} onChange={(e) => handleSlotChange(index, 'day', e.target.value)} className="w-full input-styled py-2 px-3 bg-background cursor-pointer">
                               {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                             </select>
                          </div>
                          <div className="flex items-center gap-2 flex-1 w-full">
                              <input type="time" value={slot.from} onChange={(e) => handleSlotChange(index, 'from', e.target.value)} className="w-full input-styled py-2 px-2 text-center" />
                              <span className="text-muted-foreground font-medium">-</span>
                              <input type="time" value={slot.to} onChange={(e) => handleSlotChange(index, 'to', e.target.value)} className="w-full input-styled py-2 px-2 text-center" />
                          </div>
                          <button type="button" onClick={() => handleRemoveSlot(index)} className="w-full sm:w-auto p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // VIEW MODE (Read-only Grid - Visible to Everyone)
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {availability && availability.length > 0 ? (
                      availability
                        .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day)) 
                        .map((slot, index) => (
                          <div key={index} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors group">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-primary/70 group-hover:bg-primary transition-colors"></div>
                               <span className="font-medium text-foreground">{slot.day}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-background px-2.5 py-1.5 rounded-md shadow-sm border border-border/50">
                              <Clock className="w-3.5 h-3.5" />
                              {slot.from} - {slot.to}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="col-span-full py-8 text-center text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border/50">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No availability slots listed currently.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- SECTION 3: REVIEWS (Visible to Everyone) --- */}
            <div className="card-elevated p-5 sm:p-6">
              <h2 className="text-xl font-display font-semibold text-foreground mb-6">
                Reviews ({reviews.length})
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8 bg-secondary/10 rounded-xl">
                  No reviews yet
                </p>
              )}
            </div>

            {/* Sticky Actions Footer (Only for Owner in Edit Mode) */}
            {editing && isOwnProfile && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border z-10 md:static md:bg-transparent md:border-0 md:p-0 md:mb-8">
                <div className="container-app max-w-4xl mx-auto flex items-center justify-end gap-3">
                  <button type="button" onClick={cancelEdit} className="px-6 py-2.5 rounded-lg font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-gradient px-6 py-2.5 rounded-lg font-medium flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {editing && <div className="h-20 md:hidden"></div>}

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;