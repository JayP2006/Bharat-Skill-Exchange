import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Video, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

const SessionCard = ({ session, onComplete }) => {
  const { user } = useAuth();
  
  const {
    _id,
    skillName,
    requestedDate, 
    booking,        // Fallback ke liye
    status,
    meetingLink,
    receiver, 
  } = session;

  // 🛠️ Date Fix: Dono models check karein (Session ka requestedDate ya Booking ka scheduledAt)
  const finalDate = requestedDate || booking?.scheduledAt;

  // 🛡️ Practical Logic: Guru + Scheduled + Time Check
  const isGuru = user?._id === receiver;
  const sessionStartTime = new Date(finalDate); 
  const isTimeStarted = new Date() >= sessionStartTime; // Kya samay ho chuka hai?
  
  const canComplete = isGuru && status === 'scheduled' && isTimeStarted;

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="card-elevated card-hover overflow-hidden group">
      <Link to={`/sessions/${_id}`} className="block">
        <div className="relative h-44 bg-gradient-to-br from-accent/10 to-primary/10 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <Video className="w-12 h-12 text-primary/40" />
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground`}>
              Online Session
            </span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {skillName}
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDate(finalDate)}</span>
              <Clock className="w-4 h-4 text-primary ml-2" />
              <span>{formatTime(finalDate)}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 space-y-2">
        <div className="flex items-center justify-between pt-3 border-t border-border mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'scheduled' ? 'bg-green-500' : 'bg-orange-500'}`} />
            <span className="text-sm text-muted-foreground capitalize">{status}</span>
          </div>
          <span className="text-sm font-medium text-foreground">by {receiver?.name || 'Guru'}</span>
        </div>

        <div className="flex flex-col gap-2">
          {meetingLink && status === 'scheduled' && (
            <a href={meetingLink} target="_blank" rel="noreferrer" className="w-full btn-primary flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg">
              Join Session <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* 🔥 Safety Fix: Button tabhi dikhega jab samay ho chuka ho */}
          {canComplete ? (
            <button 
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm("Are you sure the session is finished?")) {
                  onComplete(_id);
                }
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Complete Session
            </button>
          ) : isGuru && status === 'scheduled' ? (
            <div className="w-full bg-slate-50 text-slate-400 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg border border-dashed">
              <AlertCircle className="w-3 h-3" /> Waiting for scheduled time...
            </div>
          ) : null}

          {status === 'completed' && (
            <div className="w-full bg-slate-100 text-emerald-600 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg">
              <CheckCircle className="w-4 h-4" /> Session Finished
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;     