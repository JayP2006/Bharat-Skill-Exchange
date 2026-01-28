const cron = require('node-cron');
const crypto = require('crypto'); 
const Booking = require('../models/Booking');
const SessionRequest = require('../models/SessionRequest');
const User = require('../models/User');
const Certificate = require('../models/Certificate'); 

const initCronJobs = () => {
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running Auto-Complete & Certificate Task...');
    
    try {
      const now = new Date();

      const expiredBookings = await Booking.find({
        status: 'SCHEDULED',
        scheduledAt: { $lt: new Date(now.getTime() - (2 * 60 * 60 * 1000)) } 
      });

      for (let booking of expiredBookings) {
        
  
        booking.status = 'COMPLETED';
        await booking.save();


        const session = await SessionRequest.findOne({ booking: booking._id });
        if (session && session.status !== 'completed') {
          session.status = 'completed';
          await session.save();

          const guru = await User.findById(booking.guru);
          if (guru) {
            guru.walletBalance += 1;
            await guru.save();
            console.log(`✅ Auto-completed: Booking ${booking._id}, Credited Guru ${guru.name}`);
          }
        }
        try {
          const existingCert = await Certificate.findOne({ booking: booking._id });
          
          if (!existingCert) {
            const verificationCode = crypto.randomBytes(4).toString('hex').toUpperCase();

            await Certificate.create({
              shishya: booking.learner || booking.user,
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

      }
    } catch (err) {
      console.error('Cron Job Error:', err);
    }
  });
};

module.exports = initCronJobs;