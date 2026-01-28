import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, User } from 'lucide-react';

const SkillCard = ({ skill }) => {
  const {
    _id,
    title,
    description,
    category,
    level,
    duration,
    instructor,
    rating,
    reviewCount,
    media, // 👈 CHANGED: Retrieve 'media' array instead of 'image'
  } = skill;

  // 🔥 Logic: Use the first image from media array as thumbnail
  const thumbnail = media && media.length > 0 ? media[0] : null;

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'badge-success';
      case 'intermediate':
        return 'badge-warning';
      case 'advanced':
        return 'badge-primary';
      default:
        return 'badge-primary';
    }
  };

  return (
    <Link to={`/skills/${_id}`} className="block">
      <div className="card-elevated card-hover overflow-hidden group">
        
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
          {thumbnail ? (
            // ✅ Display AI Generated Image if available
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            // ❌ Fallback to Initials if no image
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{title?.charAt(0)}</span>
              </div>
            </div>
          )}
          
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium text-foreground">
              {category}
            </span>
          </div>
        </div>

        {/* Content Section (Unchanged) */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={getLevelColor(level)}>{level}</span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {duration || '1h'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {instructor?.avatar ? (
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-primary" />
                )}
              </div>
              <span className="text-sm font-medium text-foreground truncate max-w-[100px]">
                {instructor?.name || 'Instructor'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-medium text-foreground">
                {rating?.toFixed(1) || '5.0'}
              </span>
              <span className="text-sm text-muted-foreground">
                ({reviewCount || 0})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SkillCard;