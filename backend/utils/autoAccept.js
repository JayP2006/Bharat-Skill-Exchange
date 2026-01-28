
const shouldAutoAccept = ({ guru, scheduledAt }) => {
  const hour = new Date(scheduledAt).getHours();

  if (hour >= 10 && hour <= 18) return true;
  return false;
};

module.exports = { shouldAutoAccept };
