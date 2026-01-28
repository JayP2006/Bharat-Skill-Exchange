const cron = require('node-cron');
const crypto = require('crypto'); // 👈 NEW: For Certificate Code
const Booking = require('../models/Booking');
const SessionRequest = require('../models/SessionRequest');
const User = require('../models/User');
const Certificate = require('../models/Certificate'); // 👈 NEW: Certificate Model

const initCronJobs = () => {
  // Har 30 minute mein check karega
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running Auto-Complete & Certificate Task...');
    
    try {
      const now = new Date();

      // 1. Un bookings ko dhundo jo SCHEDULED hain aur jinka time nikal chuka hai
      // Hum 2 ghante ka grace period de rahe hain (scheduledAt + duration + 2 hours)
      const expiredBookings = await Booking.find({
        status: 'SCHEDULED',
        scheduledAt: { $lt: new Date(now.getTime() - (2 * 60 * 60 * 1000)) } // 2 hours ago
      });

      for (let booking of expiredBookings) {
        
        // --- OLD LOGIC START (AS IT IS) ---

        // Status update karein
        booking.status = 'COMPLETED';
        await booking.save();

        // 2. Corresponding Session ko bhi complete karein
        const session = await SessionRequest.findOne({ booking: booking._id });
        if (session && session.status !== 'completed') {
          session.status = 'completed';
          await session.save();

          // 3. Guru ko Wallet Credit dein
          const guru = await User.findById(booking.guru);
          if (guru) {
            guru.walletBalance += 1;
            await guru.save();
            console.log(`✅ Auto-completed: Booking ${booking._id}, Credited Guru ${guru.name}`);
          }
        }
        
        // --- OLD LOGIC END ---


        // --- 🔥 NEW LOGIC ADDED: AUTO ISSUE CERTIFICATE ---
        try {
          // Check karein kahin pehle se certificate to nahi hai
          const existingCert = await Certificate.findOne({ booking: booking._id });
          
          if (!existingCert) {
            const verificationCode = crypto.randomBytes(4).toString('hex').toUpperCase();

            await Certificate.create({
              shishya: booking.learner || booking.user, // Learner ID (Check your Booking Schema field name)
              guru: booking.guru,
              skill: booking.skill,
              booking: booking._id,
              verificationCode: verificationCode,
              certificateUrl: `/api/certificates/${verificationCode}/download`
            });

            console.log(`🎓 Certificate Issued Auto: ${verificationCode}`);
          }
        } catch (certError) {
          console.error(`❌ Certificate Issue Failed for ${booking._id}:`, certError.message);
        }
        // --------------------------------------------------

      }
    } catch (err) {
      console.error('Cron Job Error:', err);
    }
  });
};

module.exports = initCronJobs;