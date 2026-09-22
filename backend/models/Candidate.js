import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    id: String,
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    startDate: String,
    endDate: String,
    description: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    id: String,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["CURRENT", "UPCOMING", "COMPLETED"],
      required: true,
    },
    techStack: [String],
    projectUrl: String,
    mediaUrl: String,
  },
  { _id: false },
);

const candidateSchema = new mongoose.Schema(
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

    headline: {
      type: String,
      required: true,
      trim: true,
    },

    about: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      required: true,
    },

    education: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    preferredWorkMode: {
      type: String,
      enum: ["REMOTE", "HYBRID", "ONSITE"],
      required: true,
    },

    preferredRoles: {
      type: [String],
      required: true,
    },

    availability: {
      type: String,
      enum: ["IMMEDIATELY", "ONE_MONTH", "THREE_MONTHS", "NOT_LOOKING"],
      required: true,
    },

    portfolioUrl: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    profilePhotoUrl: {
      type: String,
      default: "",
    },
    coverPhotoUrl: {
      type: String,
      default: "",
    },
    pronouns: {
      type: String,
      default: "",
    },

    experience: {
      type: [experienceSchema],
      default: [],
    },
    projects: {
      type: [projectSchema],
      default: [],
    },

    featuredPostIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);
