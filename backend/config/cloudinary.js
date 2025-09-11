const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name:"",
  api_key:"",
  api_secret: "",
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