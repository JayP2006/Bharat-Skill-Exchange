module.exports = function matchScore(skillMatch, availability, rating) {
  return skillMatch * 0.5 + availability * 0.3 + rating * 0.2;
};
