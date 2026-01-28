import React, { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { reviewService } from '../../services/reviewService';

const ReviewForm = ({ bookingId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    try {
      setLoading(true);
      
      // ✅ API Call
      const response = await reviewService.createReview(bookingId, { rating, comment });

      alert("Review Submitted Successfully!");
      setRating(0);
      setComment('');

      // 🔥 Parent ko Naya Data Bhejo
      if (onSuccess) {
        // Response mein se review aur rating nikalo (Backend Step 1 dekho)
        onSuccess(response); 
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating Stars */}
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium mb-2">Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-3 rounded-lg resize-none focus:ring-2 focus:ring-primary/50 outline-none"
          rows="3"
          placeholder="Share your experience..."
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={loading || rating === 0}
        className="w-full bg-primary text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;