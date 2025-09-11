const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name:"dyb5ru6ca",
  api_key:"869863873235368",
  api_secret: "-_Q2tYbc0-6g6qRmlIb1kc5pmNo",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bharatskill-connect',
    allowed_formats: ['jpeg', 'png', 'jpg', 'mp4', 'mov'],
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };