import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    id: String,
    authorId: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const reactionSchema = new mongoose.Schema(
  {
    candidateId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["LIKE", "CELEBRATE", "INSIGHTFUL"],
      required: true,
    },
  },
  { _id: false },
);

const postSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },

    authorId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["TEXT", "PROJECT", "VIDEO"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    mediaUrl: {
      type: String,
      default: "",
    },
    mediaType: {
      type: String,
      default: "",
    },

    projectTitle: {
      type: String,
      default: "",
    },
    projectStatus: {
      type: String,
      default: "",
    },
    projectUrl: {
      type: String,
      default: "",
    },

    comments: {
      type: [commentSchema],
      default: [],
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
