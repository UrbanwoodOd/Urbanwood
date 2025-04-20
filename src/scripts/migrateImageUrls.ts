import { connectToDatabase } from "@/lib/mongodb";
import { CategoryItem } from "@/models/Category";
import { Image } from "@/models/Image";
import mongoose from "mongoose";

/**
 * Migration script to convert existing image_url entries to use image_id
 * Run this script after updating the model to support both image_url and image_id
 */
async function migrateImageUrls() {
  console.log("Starting image URL migration...");
  
  try {
    // Connect to the database
    await connectToDatabase();
    console.log("Connected to database");
    
    // Find all CategoryItems that have image_url but no image_id
    const itemsToMigrate = await CategoryItem.find({
      image_url: { $exists: true, $ne: null },
      $or: [
        { image_id: { $exists: false } },
        { image_id: null }
      ]
    });
    
    console.log(`Found ${itemsToMigrate.length} items to migrate`);
    
    // Process each item
    for (const item of itemsToMigrate) {
      try {
        console.log(`Processing item: ${item.name} (${item._id})`);
        
        // Create new Image entry
        const imageData = {
          filename: `migrated/${Date.now()}-${item.slug}.jpg`,
          originalName: `${item.name}.jpg`,
          mimeType: "image/jpeg",
          size: 0, // Unknown size for migrated images
          publicUrl: item.image_url,
          category: item.category
        };
        
        const image = new Image(imageData);
        await image.save();
        console.log(`Created Image record with ID: ${image._id}`);
        
        // Update CategoryItem with the new image_id
        item.image_id = image._id;
        await item.save();
        console.log(`Updated CategoryItem with image_id: ${image._id}`);
      } catch (err) {
        console.error(`Error migrating item ${item._id}:`, err);
      }
    }
    
    console.log("Migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the migration
migrateImageUrls();