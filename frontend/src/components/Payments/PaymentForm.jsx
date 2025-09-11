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

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Step 1: Create a booking on the backend to get a Razorpay order ID
      const bookingDetails = {
        guru: skill.guru._id,
        skill: skill._id,
        // These are placeholders, a real app would have a scheduler
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        totalAmount: skill.hourlyRate,
      };
      
      const { data: bookingResponse } = await api.post('/bookings', bookingDetails);
      const { booking, razorpayOrderId, amount, razorpayKeyId } = bookingResponse;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: razorpayKeyId,
        amount: amount,
        currency: "INR",
        name: "BharatSkill Connect",
        description: `Booking for ${skill.title}`,
        image: "/logo.svg", // Your logo
        order_id: razorpayOrderId,
        handler: async function (response) {
          // Step 3: Verify the payment on the backend
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };
            await api.post(`/bookings/verify-payment/${booking._id}`, verificationData);
            toast.success("Payment successful! Your booking is confirmed.");
            navigate('/profile'); // Redirect to profile/dashboard
          } catch (verifyError) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#4F46E5",
        },
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

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
        <Button onClick={handlePayment} className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Processing...' : 'Proceed to Pay'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;