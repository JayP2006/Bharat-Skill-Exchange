const Review = require('../models/Review');
const Booking = require("../models/Booking");
const mongoose = require('mongoose');
const Skill = require('../models/Skill');

exports.createReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const { bookingId } = req.params;

        let booking;
        if (mongoose.Types.ObjectId.isValid(bookingId)) {
            booking = await Booking.findById(bookingId);
        }

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

        const existingReview = await Review.findOne({ booking: booking._id });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this session" });
        }

        const newReview = await Review.create({
            shishya: req.user.id,
            guru: booking.guru,
            skill: booking.skill,
            booking: booking._id,
            rating,
            comment,
        });

        const stats = await Review.aggregate([
            { $match: { skill: booking.skill } },
            { $group: { _id: '$skill', averageRating: { $avg: '$rating' } } }
        ]);

        const newAverageRating = stats[0]?.averageRating || rating;

        
        await Skill.findByIdAndUpdate(booking.skill, { rating: newAverageRating });

        
        await newReview.populate('shishya', 'name avatar');

        
        res.status(201).json({
            success: true,
            review: newReview,
            newRating: newAverageRating 
        });

    } catch (error) {
        console.error("Review Error:", error);
        next(error);
    }
};


exports.getUserReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ guru: req.params.userId })
            .populate('shishya', 'name avatar') 
            .populate('skill', 'title')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ reviews });
    } catch (error) {
        next(error);
    }
};

exports.getReviewsForSkill = async (req, res, next) => {
    try {
        const reviews = await Review.find({ skill: req.params.skillId })
            .populate('shishya', 'name avatar');
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};


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