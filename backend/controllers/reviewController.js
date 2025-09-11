const Review = require('../models/Review');
const mongoose = require('mongoose')
exports.createReview = async (req, res, next) => {
    const { guru, skill, rating, comment } = req.body;
    try {
        
        const review = await Review.create({
            shishya: req.user.id,
            guru,
            skill,
            rating,
            comment,
        });
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};

exports.getReviewsForSkill = async (req, res, next) => {
    try {
        const reviews = await Review.find({ skill: req.params.skillId }).populate('shishya', 'name avatar');
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}
exports.getGuruAverageRating = async (req, res, next) => {
    try {
        const guruId = req.user.id;
        console.log(`Fetching average rating for Guru ID: ${guruId}`);
        // ✅ THE FIX: Yahan hum string ID ko MongoDB ke special ObjectId format mein badal rahe hain.
        // Yeh aapke suggestion ko implement karne ka sahi tareeka hai.
        const result = await Review.aggregate([
            // Step 1: Sirf is Guru ke saare reviews dhoondho
            { $match: { guru: new mongoose.Types.ObjectId(guruId) } },
            
            // Step 2: Un sabhi reviews ka average nikalo
            { $group: {
                _id: '$guru',
                averageRating: { $avg: '$rating' }
            }}
        ]);

        if (result.length > 0) {
            // Agar reviews hain, to average bhejo
            res.status(200).json({ averageRating: result[0].averageRating });
        } else {
            // Agar koi review nahi hai, to 0 bhejo
            res.status(200).json({ averageRating: 0 });
        }
    } catch (error) {
        console.error("Error fetching guru's average rating:", error);
        next(error);
    }
};