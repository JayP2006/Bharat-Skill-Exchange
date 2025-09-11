import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, Users, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkshopCard = ({ workshop }) => {
  const navigate = useNavigate();
  const workshopDate = new Date(workshop.dateTime);

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <CardHeader>
          <CardTitle>{workshop.title}</CardTitle>
          <CardDescription>Hosted by {workshop.guru.name}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">{workshop.description}</p>
          <div className="text-sm text-foreground space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{workshopDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{workshopDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ({workshop.durationMinutes} mins)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>{workshop.seatsBooked} / {workshop.seatLimit} seats booked</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between bg-muted/50 p-4">
          <div className="flex items-center font-bold text-lg">
            <IndianRupee className="w-5 h-5" />
            <span>{workshop.price}</span>
          </div>
          <Button 
            onClick={() => navigate(`/booking/workshop/${workshop._id}`)}
            disabled={workshop.seatsBooked >= workshop.seatLimit}
          >
            {workshop.seatsBooked >= workshop.seatLimit ? 'Sold Out' : 'Book a Seat'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default WorkshopCard;