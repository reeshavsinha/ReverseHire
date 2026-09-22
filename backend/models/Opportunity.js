import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },

    candidate: {
      type: String,
      required: true,
      index: true,
    },

    company: {
      type: String,
      required: true,
      index: true,
    },

    roleTitle: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    workMode: {
      type: String,
      enum: ["REMOTE", "HYBRID", "ONSITE"],
      required: true,
    },

    compensation: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DECLINED"],
      default: "PENDING",
      index: true,
    },

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Opportunity || mongoose.model("Opportunity", opportunitySchema);
