// utils/autoAccept.js
const shouldAutoAccept = ({ guru, scheduledAt }) => {
  const hour = new Date(scheduledAt).getHours();

  // example rules
  if (hour >= 10 && hour <= 18) return true;
  return false;
};

module.exports = { shouldAutoAccept };
