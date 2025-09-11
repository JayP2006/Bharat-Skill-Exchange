import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Loader2, IndianRupee } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ skill }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Function ka naam badal kar handleDirectBooking kar dete hain
  const handleDirectBooking = async () => {
    setLoading(true);
    try {
      // Step 1: Booking ki details taiyaar karein
      const bookingDetails = {
        guru: skill.guru._id,
        skill: skill._id,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        totalAmount: skill.hourlyRate,
      };
      
      // Step 2: Backend ko seedha booking create karne ke liye request bhejein
      await api.post('/bookings', bookingDetails);
      
      // Step 3: Success ka message dikhayein aur user ko redirect karein
      toast.success("Booking confirmed successfully!");
      navigate('/profile'); // User ko uske profile/dashboard par bhej dein

    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Booking</CardTitle>
        <CardDescription>You are booking a session for "{skill.title}" with {skill.guru.name}.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <span className="text-muted-foreground">Total Amount</span>
          <span className="text-2xl font-bold flex items-center">
            <IndianRupee className="h-6 w-6" /> {skill.hourlyRate}
          </span>
        </div>
        {/* Button ab handleDirectBooking ko call karega */}
        <Button onClick={handleDirectBooking} className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Booking...' : 'Confirm & Book Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;