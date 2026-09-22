import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    industry: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    website: {
      type: String,
      default: "",
    },

    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Company || mongoose.model("Company", companySchema);
