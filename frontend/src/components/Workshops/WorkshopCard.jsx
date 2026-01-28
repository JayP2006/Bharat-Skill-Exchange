import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';

const WorkshopCard = ({ workshop }) => {
  const {
    _id,
    title,
    description,
    date,
    time,
    location,
    capacity,
    enrolledCount,
    instructor,
    image,
    isOnline,
  } = workshop;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const spotsLeft = capacity - (enrolledCount || 0);

  return (
    <Link to={`/workshops/${_id}`} className="block">
      <div className="card-elevated card-hover overflow-hidden group">
        {/* Image */}
        <div className="relative h-44 bg-gradient-to-br from-accent/10 to-primary/10 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-primary/40" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isOnline 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-accent text-accent-foreground'
            }`}>
              {isOnline ? 'Online' : 'In-Person'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDate(date)}</span>
              <Clock className="w-4 h-4 text-primary ml-2" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate">{location || 'Online'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">
              by {instructor?.name || 'Instructor'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkshopCard;
