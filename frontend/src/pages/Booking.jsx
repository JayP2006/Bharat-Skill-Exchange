import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSkillStore from '@/store/skillStore';
import useAuthStore from '@/store/authStore';
import { motion } from 'framer-motion';
import { Loader2, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import PaymentForm from '@/components/Payments/PaymentForm';
import ReviewForm from '@/components/Reviews/ReviewForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import api from '@/utils/api';

const Booking = () => {
    const { skillId } = useParams();
    const { skill, loading, fetchSkillById } = useSkillStore();
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    useEffect(() => {
        if (skillId) {
            fetchSkillById(skillId);
            api.get(`/reviews/skill/${skillId}`)
               .then(res => setReviews(res.data))
               .finally(() => setReviewsLoading(false));
        }
    }, [skillId, fetchSkillById]);

    const handleReviewSubmit = (newReview) => {
        
        setReviews(prevReviews => [newReview, ...prevReviews]);
    };

    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    if (loading || !skill) {
        return <div className="flex h-[60vh] w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }
    
   
    const hasUserReviewed = reviews.some(review => review.shishya._id === user?._id);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardContent className="p-0">
                        <img src={skill.media?.[0] || `https://placehold.co/800x400/6366f1/FFFFFF?text=${skill.title}`} alt={skill.title} className="w-full h-64 object-cover rounded-t-lg"/>
                        <div className="p-6 space-y-4">
                            <h1 className="text-4xl font-bold">{skill?.title}</h1>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12"><AvatarImage src={skill?.guru?.avatar} alt={skill?.guru?.name} /><AvatarFallback>{getInitials(skill?.guru?.name)}</AvatarFallback></Avatar>
                                <div><p className="font-semibold">{skill.guru.name}</p><p className="text-sm text-muted-foreground">Guru</p></div>
                                <div className="flex items-center gap-1 font-semibold text-amber-500 ml-auto"><Star className="w-5 h-5 fill-current" /><span>{skill.averageRating?.toFixed(1) || 'New'}</span></div>
                            </div>
                            <div><h2 className="text-2xl font-semibold mb-2">About this skill</h2><p className="text-muted-foreground leading-relaxed">{skill.description}</p></div>
                        </div>
                    </CardContent>
                </Card>

              
                {user?.role === 'Shishya' && !hasUserReviewed && (
                    <Card>
                        <CardHeader><CardTitle>Leave a Review</CardTitle><CardDescription>Share your experience with the community.</CardDescription></CardHeader>
                        <CardContent><ReviewForm guruId={skill.guru._id} skillId={skill._id} onReviewSubmit={handleReviewSubmit} /></CardContent>
                    </Card>
                )}
                
                <Card>
                    <CardHeader><CardTitle>Reviews ({reviews.length})</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {reviewsLoading ? <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin"/></div> :
                        reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review._id} className="flex gap-4 border-b pb-4 last:border-b-0">
                                    <Avatar><AvatarImage src={review.shishya.avatar} /><AvatarFallback>{getInitials(review.shishya.name)}</AvatarFallback></Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">{review.shishya.name}</p>
                                            <div className="flex items-center text-amber-500">{[...Array(review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current"/>)}</div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first to leave a review!</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                <div className="sticky top-24">
                    <PaymentForm skill={skill} />
                </div>
            </div>
        </motion.div>
    );
};

export default Booking;