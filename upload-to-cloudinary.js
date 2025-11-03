const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configure Cloudinary from environment variables
// Never hardcode credentials in the repository.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// All media files to upload
const mediaFiles = {
  videos: [
    'vid1.mp4',
    'vid2 (1).mp4',
    'vid4.mp4',
    'vid5.mp4',
    'vid6.mp4',
    'vid7.mp4',
    'vid9.mp4',
    'vid10.mp4',
    'vid11.mp4',
    'Untitled video - Made with Clipchamp (1).mp4',
    'Untitled video - Made with Clipchamp (4).mp4',
    'Untitled video - Made with Clipchamp (6).mp4',
    'Untitled video - Made with Clipchamp (7).mp4',
    'Untitled video - Made with Clipchamp.mp4',
    'ef4046d2-c52a-4d00-b38a-b77cc85ad049 (1).mp4'
  ],
  images: [
    'card-annapurna.jpg',
    'card-bhaktapur.jpg',
    'card-chitwan.jpg',
    'card-everest.jpg',
    'card-kathmandu.jpg',
    'card-langtang.jpg',
    'card-manaslu.jpg',
    'card-mustang.jpg',
    'card-pokhara.jpg',
    'changu-narayan_temple01.jpg',
    'Pashupatinath-Temple-Pooja.webp',
    'Lumbini_-_Mayadevi_Temple_from_South,_Lumbini_(9244243566).jpg',
    'Ghodaghodi-lake-1290x540.jpg',
    'images (1) (1).jpeg'
  ]
};

// Clean filename for use as public_id
function cleanFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '_') // Replace special chars with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
}

async function uploadFile(filename, type) {
  const filePath = path.join(__dirname, 'frontend', 'public', 'assets', filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return null;
  }
  
  const fileSize = fs.statSync(filePath).size;
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
  console.log(`⬆️  Uploading ${type}: ${filename} (${fileSizeMB} MB)...`);
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: type === 'video' ? 'video' : 'image',
      folder: 'nepal-connect',
      public_id: cleanFilename(filename),
      overwrite: true,
      // Optimize images automatically
      ...(type === 'image' && {
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      })
    });
    
    console.log(`✅ Uploaded: ${filename}`);
    console.log(`   URL: ${result.secure_url}\n`);
    
    return {
      original: filename,
      url: result.secure_url,
      publicId: result.public_id
    };
    
  } catch (error) {
    console.error(`❌ Error uploading ${filename}:`, error.message);
    return null;
  }
}

async function uploadAll() {
  // Basic validation
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary credentials are not set. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to your .env');
    process.exit(1);
  }

  console.log('🚀 Starting upload to Cloudinary...\n');
  
  const results = {
    videos: [],
    images: []
  };
  
  // Upload videos
  console.log('📹 Uploading Videos...\n');
  for (const video of mediaFiles.videos) {
    const result = await uploadFile(video, 'video');
    if (result) results.videos.push(result);
  }
  
  // Upload images
  console.log('\n📸 Uploading Images...\n');
  for (const image of mediaFiles.images) {
    const result = await uploadFile(image, 'image');
    if (result) results.images.push(result);
  }
  
  // Save results to JSON file
  fs.writeFileSync('cloudinary-urls.json', JSON.stringify(results, null, 2));
  
  console.log('\n✅ All uploads complete!');
  console.log(`📝 URLs saved to cloudinary-urls.json`);
  console.log(`\n📊 Summary:`);
  console.log(`   Videos uploaded: ${results.videos.length}/${mediaFiles.videos.length}`);
  console.log(`   Images uploaded: ${results.images.length}/${mediaFiles.images.length}`);
}

uploadAll().catch(console.error);