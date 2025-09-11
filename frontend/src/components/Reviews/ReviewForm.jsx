import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Star, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utils/api';

const ReviewForm = ({ guruId, skillId, onReviewSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (rating === 0) {
      return toast.error("Please select a star rating.");
    }
    setLoading(true);
    try {
      const reviewData = { guru: guruId, skill: skillId, rating, comment: data.comment };
      const response = await api.post('/reviews', reviewData);
      toast.success("Thank you for your review!");
      reset(); // Form ko reset karein
      setRating(0); // Rating ko reset karein
      if (onReviewSubmit) onReviewSubmit(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label>Your Rating</Label>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <button type="button" key={ratingValue} onClick={() => setRating(ratingValue)} onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(0)}>
                <Star className={`h-6 w-6 cursor-pointer transition-colors ${ratingValue <= (hover || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="comment">Your Review</Label>
        <Textarea id="comment" placeholder="Tell us about your experience..." {...register("comment", { required: "Please write a comment." })} />
        {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;