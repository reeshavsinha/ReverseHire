import "dotenv/config";
import mongoose from "mongoose";

import Candidate from "../models/Candidate.js";
import Company from "../models/Company.js";
import Opportunity from "../models/Opportunity.js";
import Post from "../models/Post.js";

import {
  seedCandidates,
  seedCompanies,
  seedOpportunities,
  seedPosts,
} from "../data/seedData.js";
import { store } from "../store/dataStore.js";

const mongoUri = process.env.MONGODB_URI;

store.reset();
console.log("In-memory store reset with seed data.");

if (mongoUri) {
  try {
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB successfully.");

    await Candidate.deleteMany({});
    await Company.deleteMany({});
    await Opportunity.deleteMany({});
    await Post.deleteMany({});

    await Candidate.insertMany(seedCandidates);
    await Company.insertMany(seedCompanies);
    await Opportunity.insertMany(seedOpportunities);
    await Post.insertMany(seedPosts);

    console.log("MongoDB collections populated successfully:");
    console.log(`- Candidates: ${await Candidate.countDocuments()}`);
    console.log(`- Companies: ${await Company.countDocuments()}`);
    console.log(`- Opportunities: ${await Opportunity.countDocuments()}`);
    console.log(`- Posts: ${await Post.countDocuments()}`);

    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  } catch (err) {
    console.warn(`MongoDB seed skipped or failed: ${err.message}`);
    console.warn("In-memory store will continue to serve requests when fallback is active.");
  }
} else {
  console.log("MONGODB_URI not set. Skipped MongoDB seed.");
}
