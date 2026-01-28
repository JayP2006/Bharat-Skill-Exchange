const Review = require('../models/Review');
const Booking = require("../models/Booking");
const mongoose = require('mongoose');
const Skill = require('../models/Skill');

// @desc    Create a Review
// @route   POST /api/reviews/booking/:bookingId


exports.createReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const { bookingId } = req.params;

        // 1. Booking / Skill dhoondho
        let booking;
        if (mongoose.Types.ObjectId.isValid(bookingId)) {
            booking = await Booking.findById(bookingId);
        }

        // Agar Booking ID nahi hai, toh Skill ID se Completed Booking dhoondho
        if (!booking) {
            booking = await Booking.findOne({
                learner: req.user.id,
                skill: bookingId,
                status: 'COMPLETED'
            }).sort({ createdAt: -1 });
        }

        if (!booking) {
            return res.status(404).json({ message: "No completed booking found to review." });
        }

        // 2. Duplicate Check
        const existingReview = await Review.findOne({ booking: booking._id });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this session" });
        }

        // 3. Review Create karo
        const newReview = await Review.create({
            shishya: req.user.id,
            guru: booking.guru,
            skill: booking.skill,
            booking: booking._id,
            rating,
            comment,
        });

        // 🔥 STEP 4: Rating TURANT Calculate karo (Force Update)
        const stats = await Review.aggregate([
            { $match: { skill: booking.skill } },
            { $group: { _id: '$skill', averageRating: { $avg: '$rating' } } }
        ]);

        const newAverageRating = stats[0]?.averageRating || rating;

        // Skill Table bhi update karo
        await Skill.findByIdAndUpdate(booking.skill, { rating: newAverageRating });

        // Review ko populate karo (taaki naam/photo dikhe)
        await newReview.populate('shishya', 'name avatar');

        // ✅ RESPONSE: Review + Nayi Rating bhejo
        res.status(201).json({
            success: true,
            review: newReview,
            newRating: newAverageRating // 👈 Ye hai wo cheez jo realtime update karegi
        });

    } catch (error) {
        console.error("Review Error:", error);
        next(error);
    }
};

// @desc    Get Reviews for a specific User (Guru)
// @route   GET /api/reviews/user/:userId
exports.getUserReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ guru: req.params.userId })
            .populate('shishya', 'name avatar') // Populate reviewer details
            .populate('skill', 'title') // Populate skill name
            .sort({ createdAt: -1 }); // Newest first
            
        res.status(200).json({ reviews });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Reviews for a Skill
// @route   GET /api/reviews/skill/:skillId
exports.getReviewsForSkill = async (req, res, next) => {
    try {
        const reviews = await Review.find({ skill: req.params.skillId })
            .populate('shishya', 'name avatar');
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Average Rating for Dashboard
// @route   GET /api/reviews/my-rating
exports.getGuruAverageRating = async (req, res, next) => {
    try {
        const guruId = req.user.id;
        const result = await Review.aggregate([
            { $match: { guru: new mongoose.Types.ObjectId(guruId) } },
            { $group: {
                _id: '$guru',
                averageRating: { $avg: '$rating' }
            }}
        ]);

        if (result.length > 0) {
            res.status(200).json({ averageRating: result[0].averageRating });
        } else {
            res.status(200).json({ averageRating: 0 });
        }
    } catch (error) {
        next(error);
    }
};