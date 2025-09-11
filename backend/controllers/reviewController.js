const Review = require('../models/Review');

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