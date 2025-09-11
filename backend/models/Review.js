const mongoose = require('mongoose');
const Skill = require('./Skill');

const ReviewSchema = new mongoose.Schema({
  shishya: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  guru: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  skill: { type: mongoose.Schema.ObjectId, ref: 'Skill', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });


ReviewSchema.statics.getAverageRating = async function(skillId) {
  const obj = await this.aggregate([
    { $match: { skill: skillId } },
    { $group: { _id: '$skill', averageRating: { $avg: '$rating' } } }
  ]);
  
  try {
    await Skill.findByIdAndUpdate(skillId, {
      averageRating: obj[0] ? obj[0].averageRating.toFixed(1) : 0
    });
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.skill);
});

ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.skill);
});


module.exports = mongoose.model('Review', ReviewSchema);