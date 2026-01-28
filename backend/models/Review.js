const mongoose = require('mongoose');
const Skill = require('./Skill'); // 👈 Skill Model import karna zaroori hai

const ReviewSchema = new mongoose.Schema({
  shishya: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  guru: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  skill: { type: mongoose.Schema.ObjectId, ref: 'Skill', required: true },
  booking: { type: mongoose.Schema.ObjectId, ref: 'Booking' }, // Optional link
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

// 🔥 REAL-TIME CALCULATION LOGIC
ReviewSchema.statics.calcAverageRating = async function(skillId) {
  // 1. Saare reviews ka average nikalo
  const stats = await this.aggregate([
    {
      $match: { skill: skillId }
    },
    {
      $group: {
        _id: '$skill',
        averageRating: { $avg: '$rating' }, // Average
        numOfReviews: { $sum: 1 } // Total Count
      }
    }
  ]);

  // 2. Skill Table mein update kar do
  try {
    if (stats.length > 0) {
      await Skill.findByIdAndUpdate(skillId, {
        rating: stats[0].averageRating,
        // Agar aapke Skill model mein 'reviewCount' field hai to use bhi update karein
        // reviewCount: stats[0].numOfReviews 
      });
      console.log(`✅ Rating Updated: ${stats[0].averageRating}`);
    } else {
      // Agar reviews delete ho gaye aur 0 bache
      await Skill.findByIdAndUpdate(skillId, {
        rating: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Jab Naya Review Save ho -> Tab Calculate karo
ReviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.skill);
});

// (Optional) Jab Review Delete ho (Agar future mein delete feature laye)
// ReviewSchema.post('remove', function() {
//   this.constructor.calcAverageRating(this.skill);
// });

module.exports = mongoose.model('Review', ReviewSchema);