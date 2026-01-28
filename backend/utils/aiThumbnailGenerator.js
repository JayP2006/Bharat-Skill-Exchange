const axios = require('axios'); // Keeps axios for consistency, though we just need the URL mostly
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateAiThumbnail = async (skillTitle, category) => {
  try {
    console.log(`🎨 Generating AI Thumbnail via Pollinations for: ${skillTitle}...`);

    // 1. Construct a smart prompt
    let extraContext = "";
    if (category === 'Technology') extraContext = "tech stack, coding screen, futuristic, cyber, glowing nodes";
    else if (category === 'Business') extraContext = "financial growth, office desk, laptop, professional";
    else if (category === 'Design') extraContext = "color palette, digital art, creative workspace";
    else extraContext = "educational, learning, books, knowledge";

    const prompt = `minimalist 3d render of ${skillTitle}, ${extraContext}, clean background, soft lighting, 4k, high quality, trending on artstation`;
    
    // 2. Pollinations.ai URL (No API Key needed!)
    // We encode the prompt into the URL
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 10000)}&nologo=true`;

    // 3. Fetch the image as a buffer to upload to Cloudinary
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    // 4. Convert Buffer to Base64
    const buffer = Buffer.from(response.data, "binary");
    const base64Image = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    // 5. Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "skill-thumbnails",
      resource_type: "image",
    });

    console.log("✅ AI Thumbnail Saved:", uploadResponse.secure_url);
    return uploadResponse.secure_url;

  } catch (error) {
    console.error("⚠️ AI Generation Failed:", error.message);
    // Safe Fallback
    return "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"; 
  }
};

module.exports = generateAiThumbnail;