import { randomUUID } from "node:crypto";
import { isMongoConnected } from "../config/db.js";
import Candidate from "../models/Candidate.js";
import Post from "../models/Post.js";
import { store } from "../store/dataStore.js";
import {
  cleanString,
  validateComment,
  validatePost,
} from "../utils/validation.js";

const postFields = [
  "type",
  "content",
  "mediaUrl",
  "mediaType",
  "projectTitle",
  "projectStatus",
  "projectUrl",
];

const pickPostFields = (body) =>
  postFields.reduce((result, field) => {
    if (body[field] !== undefined) result[field] = cleanString(body[field]);
    return result;
  }, {});

const validationError = (res, errors) =>
  res.status(400).json({
    success: false,
    message: "Please fix the highlighted fields",
    errors,
  });

const ensureCandidate = async (candidateId) => {
  if (!candidateId) return false;
  if (isMongoConnected()) {
    const candidate = await Candidate.findOne({ id: candidateId }).lean();
    return Boolean(candidate);
  }
  return Boolean(store.findById("candidates", candidateId));
};

const authorSummaryFromData = (candidate, authorId) => {
  if (!candidate) return { id: authorId, name: "Unknown candidate" };
  return {
    id: candidate.id,
    name: candidate.name,
    headline: candidate.headline,
    profilePhotoUrl: candidate.profilePhotoUrl || "",
  };
};

const populatePostSingle = async (post, viewerId = "") => {
  if (!post) return null;

  if (isMongoConnected()) {
    const authorIds = [
      post.authorId,
      ...(post.comments || []).map((c) => c.authorId),
    ].filter(Boolean);
    const uniqueIds = [...new Set(authorIds)];
    const candidates = await Candidate.find({ id: { $in: uniqueIds } }).lean();
    const candMap = new Map(candidates.map((c) => [c.id, c]));

    const author = authorSummaryFromData(candMap.get(post.authorId), post.authorId);
    const comments = (post.comments || []).map((comment) => ({
      ...comment,
      author: authorSummaryFromData(candMap.get(comment.authorId), comment.authorId),
    }));

    return {
      ...post,
      author,
      comments,
      reactionCount: (post.reactions || []).length,
      commentCount: (post.comments || []).length,
      viewerReaction:
        (post.reactions || []).find((reaction) => reaction.candidateId === viewerId)?.type || null,
    };
  }

  // Fallback: store
  const authorCand = store.findById("candidates", post.authorId);
  const author = authorSummaryFromData(authorCand, post.authorId);
  const comments = (post.comments || []).map((comment) => ({
    ...comment,
    author: authorSummaryFromData(store.findById("candidates", comment.authorId), comment.authorId),
  }));

  return {
    ...post,
    author,
    comments,
    reactionCount: (post.reactions || []).length,
    commentCount: (post.comments || []).length,
    viewerReaction:
      (post.reactions || []).find((reaction) => reaction.candidateId === viewerId)?.type || null,
  };
};

const populatePostMultiple = async (posts, viewerId = "") => {
  if (!posts.length) return [];

  if (isMongoConnected()) {
    const allAuthorIds = [];
    posts.forEach((p) => {
      if (p.authorId) allAuthorIds.push(p.authorId);
      (p.comments || []).forEach((c) => {
        if (c.authorId) allAuthorIds.push(c.authorId);
      });
    });
    const uniqueIds = [...new Set(allAuthorIds)];
    const candidates = await Candidate.find({ id: { $in: uniqueIds } }).lean();
    const candMap = new Map(candidates.map((c) => [c.id, c]));

    return posts.map((post) => {
      const author = authorSummaryFromData(candMap.get(post.authorId), post.authorId);
      const comments = (post.comments || []).map((comment) => ({
        ...comment,
        author: authorSummaryFromData(candMap.get(comment.authorId), comment.authorId),
      }));

      return {
        ...post,
        author,
        comments,
        reactionCount: (post.reactions || []).length,
        commentCount: (post.comments || []).length,
        viewerReaction:
          (post.reactions || []).find((reaction) => reaction.candidateId === viewerId)?.type ||
          null,
      };
    });
  }

  return posts.map((post) => {
    const authorCand = store.findById("candidates", post.authorId);
    const author = authorSummaryFromData(authorCand, post.authorId);
    const comments = (post.comments || []).map((comment) => ({
      ...comment,
      author: authorSummaryFromData(
        store.findById("candidates", comment.authorId),
        comment.authorId,
      ),
    }));

    return {
      ...post,
      author,
      comments,
      reactionCount: (post.reactions || []).length,
      commentCount: (post.comments || []).length,
      viewerReaction:
        (post.reactions || []).find((reaction) => reaction.candidateId === viewerId)?.type || null,
    };
  });
};

export async function listPosts(req, res, next) {
  try {
    const { authorId, type, viewerId } = req.query;

    if (isMongoConnected()) {
      const query = {};
      if (authorId) query.authorId = authorId;
      if (type) query.type = type.toUpperCase();

      const posts = await Post.find(query).sort({ createdAt: -1 }).lean();
      const populated = await populatePostMultiple(posts, viewerId);
      return res.json({ success: true, data: populated });
    }

    let posts = store.list("posts");
    if (authorId) posts = posts.filter((post) => post.authorId === authorId);
    if (type) posts = posts.filter((post) => post.type === type.toUpperCase());

    posts.sort((first, second) => second.createdAt.localeCompare(first.createdAt));
    const populated = await populatePostMultiple(posts, viewerId);
    return res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export async function getPost(req, res, next) {
  try {
    if (isMongoConnected()) {
      const post = await Post.findOne({ id: req.params.id }).lean();
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }
      const populated = await populatePostSingle(post, req.query.viewerId);
      return res.json({ success: true, data: populated });
    }

    const post = store.findById("posts", req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    const populated = await populatePostSingle(post, req.query.viewerId);
    return res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export async function createPost(req, res, next) {
  try {
    const data = {
      type: "TEXT",
      mediaUrl: "",
      mediaType: "",
      projectTitle: "",
      projectStatus: "",
      projectUrl: "",
      comments: [],
      reactions: [],
      ...pickPostFields(req.body),
      authorId: cleanString(req.body.authorId),
    };

    const errors = validatePost(data);
    const candidateValid = await ensureCandidate(data.authorId);
    if (!candidateValid) errors.push("authorId must belong to a candidate");
    if (errors.length) return validationError(res, errors);

    if (isMongoConnected()) {
      const id = `post-${randomUUID().slice(0, 8)}`;
      const created = await Post.create({ ...data, id });
      const populated = await populatePostSingle(created.toObject(), data.authorId);
      return res.status(201).json({ success: true, data: populated });
    }

    const created = store.insert("posts", data);
    const populated = await populatePostSingle(created, data.authorId);
    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const actorId = cleanString(req.body.actorId);

    if (isMongoConnected()) {
      const existing = await Post.findOne({ id: req.params.id }).lean();
      if (!existing) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      if (actorId !== existing.authorId) {
        return res.status(403).json({ success: false, message: "Only the post author can edit it" });
      }

      const data = {
        ...existing,
        ...pickPostFields(req.body),
        authorId: existing.authorId,
      };
      const errors = validatePost(data);
      if (errors.length) return validationError(res, errors);

      const updated = await Post.findOneAndUpdate(
        { id: req.params.id },
        pickPostFields(data),
        { new: true, runValidators: true },
      ).lean();

      const populated = await populatePostSingle(updated, actorId);
      return res.json({ success: true, data: populated });
    }

    const existing = store.findById("posts", req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (actorId !== existing.authorId) {
      return res.status(403).json({ success: false, message: "Only the post author can edit it" });
    }

    const data = {
      ...existing,
      ...pickPostFields(req.body),
      authorId: existing.authorId,
    };
    const errors = validatePost(data);
    if (errors.length) return validationError(res, errors);

    const updated = store.update("posts", existing.id, pickPostFields(data));
    const populated = await populatePostSingle(updated, actorId);
    return res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    const actorId = cleanString(req.query.actorId);

    if (isMongoConnected()) {
      const existing = await Post.findOne({ id: req.params.id }).lean();
      if (!existing) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      if (actorId !== existing.authorId) {
        return res.status(403).json({ success: false, message: "Only the post author can delete it" });
      }

      await Post.findOneAndDelete({ id: req.params.id });
      return res.status(204).send();
    }

    const existing = store.findById("posts", req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (actorId !== existing.authorId) {
      return res.status(403).json({ success: false, message: "Only the post author can delete it" });
    }

    store.remove("posts", existing.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function addComment(req, res, next) {
  try {
    const data = {
      candidateId: cleanString(req.body.candidateId),
      body: cleanString(req.body.body),
    };
    const errors = validateComment(data);
    const candidateValid = await ensureCandidate(data.candidateId);
    if (!candidateValid) errors.push("candidateId must belong to a candidate");
    if (errors.length) return validationError(res, errors);

    const comment = {
      id: `comment-${randomUUID().slice(0, 8)}`,
      authorId: data.candidateId,
      body: data.body,
      createdAt: new Date(),
    };

    if (isMongoConnected()) {
      const post = await Post.findOne({ id: req.params.id });
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      post.comments.push(comment);
      await post.save();

      const populated = await populatePostSingle(post.toObject(), data.candidateId);
      return res.status(201).json({ success: true, data: populated });
    }

    const post = store.findById("posts", req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const updated = store.update("posts", post.id, {
      comments: [
        ...(post.comments || []),
        { ...comment, createdAt: new Date().toISOString() },
      ],
    });
    const populated = await populatePostSingle(updated, data.candidateId);
    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const actorId = cleanString(req.query.candidateId);

    if (isMongoConnected()) {
      const post = await Post.findOne({ id: req.params.id });
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      const comment = (post.comments || []).find((item) => item.id === req.params.commentId);
      if (!comment) {
        return res.status(404).json({ success: false, message: "Comment not found" });
      }
      if (comment.authorId !== actorId) {
        return res.status(403).json({ success: false, message: "Only the comment author can delete it" });
      }

      post.comments = post.comments.filter((item) => item.id !== comment.id);
      await post.save();

      const populated = await populatePostSingle(post.toObject(), actorId);
      return res.json({ success: true, data: populated });
    }

    const post = store.findById("posts", req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comment = (post.comments || []).find((item) => item.id === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    if (comment.authorId !== actorId) {
      return res.status(403).json({ success: false, message: "Only the comment author can delete it" });
    }

    const updated = store.update("posts", post.id, {
      comments: post.comments.filter((item) => item.id !== comment.id),
    });
    const populated = await populatePostSingle(updated, actorId);
    return res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export async function toggleReaction(req, res, next) {
  try {
    const candidateId = cleanString(req.body.candidateId);
    const type = cleanString(req.body.type || "LIKE").toUpperCase();

    const candidateValid = await ensureCandidate(candidateId);
    if (!candidateValid) {
      return validationError(res, ["candidateId must belong to a candidate"]);
    }
    if (!["LIKE", "CELEBRATE", "INSIGHTFUL"].includes(type)) {
      return validationError(res, ["type must be LIKE, CELEBRATE, or INSIGHTFUL"]);
    }

    if (isMongoConnected()) {
      const post = await Post.findOne({ id: req.params.id });
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      const existingIndex = (post.reactions || []).findIndex(
        (reaction) => reaction.candidateId === candidateId,
      );

      if (existingIndex > -1) {
        if (post.reactions[existingIndex].type === type) {
          post.reactions.splice(existingIndex, 1);
        } else {
          post.reactions[existingIndex].type = type;
        }
      } else {
        post.reactions.push({ candidateId, type });
      }

      await post.save();
      const populated = await populatePostSingle(post.toObject(), candidateId);
      return res.json({ success: true, data: populated });
    }

    const post = store.findById("posts", req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const existing = (post.reactions || []).find(
      (reaction) => reaction.candidateId === candidateId,
    );
    let reactions = post.reactions || [];
    if (existing?.type === type) {
      reactions = reactions.filter((reaction) => reaction.candidateId !== candidateId);
    } else if (existing) {
      reactions = reactions.map((reaction) =>
        reaction.candidateId === candidateId ? { ...reaction, type } : reaction,
      );
    } else {
      reactions = [...reactions, { candidateId, type }];
    }

    const updated = store.update("posts", post.id, { reactions });
    const populated = await populatePostSingle(updated, candidateId);
    return res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}
