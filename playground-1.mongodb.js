/* global use, db */
// BartendersHub MongoDB Playground
// This playground is configured for the BartendersHub application database

// Select the BartendersHub database
use('bartendershub');

// Test connection by checking existing collections
console.log('Available collections:', db.getCollectionNames());

// Example: Insert a test cocktail (you can run this to test your connection)
// db.cocktails.insertOne({
//   name: "Test Mojito",
//   description: "A refreshing test cocktail",
//   ingredients: ["2 oz White Rum", "1 oz Lime Juice", "2 tsp Sugar", "6-8 Mint Leaves"],
//   instructions: ["Muddle mint and sugar", "Add rum and lime juice", "Top with soda water"],
//   difficulty: "beginner",
//   prepTime: 5,
//   servings: 1,
//   glassType: "Highball",
//   tags: ["refreshing", "mint", "rum"],
//   createdBy: null, // Will be set to actual user ID in app
//   createdAt: new Date(),
//   updatedAt: new Date()
// });

// Example: Check if users collection exists and count documents
const userCount = db.users.countDocuments();
console.log(`Current users in database: ${userCount}`);

// Example: Check if cocktails collection exists and count documents
const cocktailCount = db.cocktails.countDocuments();
console.log(`Current cocktails in database: ${cocktailCount}`);

// Example: View database stats
const stats = db.stats();
console.log('Database stats:', stats);
