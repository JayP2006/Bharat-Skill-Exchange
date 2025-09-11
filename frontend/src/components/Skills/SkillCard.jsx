import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillCard = ({ skill }) => {
  const navigate = useNavigate();
  const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'G';

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col group">
        <div className="relative">
            <img 
                src={skill.media?.[0] || `https://placehold.co/600x400/6366f1/FFFFFF?text=${skill.title.charAt(0)}`}
                alt={skill.title}
                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full text-white ${skill.mode === 'Online' ? 'bg-green-500' : 'bg-blue-500'}`}>
                {skill.mode}
            </div>
        </div>
        <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
                <AvatarImage src={skill.guru?.avatar} alt={skill.guru?.name} />
                <AvatarFallback>{getInitials(skill.guru?.name)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-lg leading-tight">{skill.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{skill.guru?.name}</p>
            </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{skill.description}</p>
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{skill.averageRating?.toFixed(1) || 'New'}</span>
                </div>
                {skill.mode === 'Offline' && skill.location?.address && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate w-24" title={skill.location.address}>{skill.location.address}</span>
                    </div>
                )}
            </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
            <span className="font-bold text-lg text-primary">₹{skill.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hr</span></span>
            <Button onClick={() => navigate(`/booking/${skill._id}`)}>Book Now</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SkillCard;