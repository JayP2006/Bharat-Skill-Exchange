import React from 'react';
import { Star, User } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const { rating, comment, createdAt, shishya } = review; // Changed reviewer to shishya

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-4 bg-card rounded-xl border border-border">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {shishya?.avatar ? ( // Changed reviewer to shishya
            <img
              src={shishya.avatar}
              alt={shishya.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-foreground truncate">
              {shishya?.name || 'Anonymous'} 
            </h4>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatDate(createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? 'text-accent fill-accent'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
            {comment}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCardd;