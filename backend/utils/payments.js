// const Razorpay = require('razorpay');
// const crypto = require('crypto');

// const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// exports.createOrder = async (amountInPaisa, receipt) => {
//   const options = {
//     amount: amountInPaisa,
//     currency: 'INR',
//     receipt: receipt,
//   };
//   try {
//     const order = await instance.orders.create(options);
//     return order;
//   } catch (error) {
//     console.error('Razorpay order creation failed:', error);
//     throw new Error('Payment order creation failed');
//   }
// };

// exports.isSignatureValid = (orderId, paymentId, signature) => {
//   const body = orderId + "|" + paymentId;
//   const expectedSignature = crypto
//     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//     .update(body.toString())
//     .digest('hex');
  
//   return expectedSignature === signature;
// };