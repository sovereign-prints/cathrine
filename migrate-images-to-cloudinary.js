/**
 * Migration script: Move all product and gallery images from PostgreSQL to Cloudinary
 *
 * This script:
 * 1. Reads all images from the 'files' table
 * 2. Uploads them to Cloudinary
 * 3. Updates product_images and gallery records with new Cloudinary URLs
 * 4. Removes the need for cold-start backend loads for images
 *
 * Run with: node migrate-images-to-cloudinary.js
 */

require('dotenv').config();
const db = require('./db');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function migrateImagesToCloudinary() {
  console.log('🚀 Starting image migration to Cloudinary...\n');

  try {
    // 1. Get all files from the database
    console.log('📦 Fetching all images from database...');
    const { rows: files } = await db.query('SELECT id, filename, mimetype, data FROM files ORDER BY id');
    console.log(`   Found ${files.length} images\n`);

    if (files.length === 0) {
      console.log('✓ No images to migrate.');
      process.exit(0);
    }

    // 2. Track migrations
    const migrations = {
      success: [],
      failed: [],
      skipped: []
    };

    // 3. Upload each file to Cloudinary
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = `[${i + 1}/${files.length}]`;

      try {
        console.log(`${progress} Uploading ${file.filename}...`);

        // Write to temp file (Cloudinary SDK needs a file path)
        const tempPath = path.join('/tmp', `cloudinary-upload-${file.id}.tmp`);
        fs.writeFileSync(tempPath, file.data);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(tempPath, {
          folder: 'sovereign-prints',
          public_id: file.id, // Use the database ID as the public ID for traceability
          resource_type: 'auto',
          overwrite: true // Allow re-uploading if migration is re-run
        });

        console.log(`   ✓ Uploaded to: ${result.secure_url}`);

        migrations.success.push({
          fileId: file.id,
          filename: file.filename,
          cloudinaryUrl: result.secure_url,
          cloudinaryPublicId: result.public_id
        });

        // Clean up temp file
        fs.unlinkSync(tempPath);

      } catch (err) {
        console.error(`   ✗ Failed: ${err.message}`);
        migrations.failed.push({
          fileId: file.id,
          filename: file.filename,
          error: err.message
        });
      }
    }

    // 4. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Successful: ${migrations.success.length}`);
    console.log(`✗ Failed: ${migrations.failed.length}`);
    console.log(`⊘ Skipped: ${migrations.skipped.length}`);

    if (migrations.failed.length > 0) {
      console.log('\n❌ Failed migrations:');
      migrations.failed.forEach(m => {
        console.log(`   - ${m.filename} (ID: ${m.fileId}): ${m.error}`);
      });
    }

    // 5. Next steps
    console.log('\n' + '='.repeat(60));
    console.log('📋 NEXT STEPS');
    console.log('='.repeat(60));
    console.log('\n1. UPDATE PRODUCT IMAGES');
    console.log('   Run this SQL to update product image URLs:');
    console.log(`
    UPDATE product_images
    SET image_url = 'https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/sovereign-prints/' || image_filename
    WHERE image_url LIKE '/uploads/%';
    `);

    console.log('\n2. UPDATE GALLERY IMAGES');
    console.log('   Run this SQL to update gallery image URLs:');
    console.log(`
    UPDATE gallery
    SET image = 'https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/sovereign-prints/' || image_filename
    WHERE image LIKE '/uploads/%';
    `);

    console.log('\n3. VERIFY IN CLOUDINARY');
    console.log('   Check: https://console.cloudinary.com/console/media_library');
    console.log('   Folder: sovereign-prints');

    console.log('\n4. TEST ON WEBSITE');
    console.log('   Visit: https://sovereignprints.onrender.com/products.html');
    console.log('   Images should load instantly without backend delay');

    console.log('\n5. CLEANUP (OPTIONAL)');
    console.log('   After verifying, optionally delete old database images:');
    console.log('   DELETE FROM files;');

    console.log('\n' + '='.repeat(60));
    console.log('✓ Migration completed!');
    console.log('='.repeat(60) + '\n');

    process.exit(0);

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

// Run migration
migrateImagesToCloudinary();
