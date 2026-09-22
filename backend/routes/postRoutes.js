import { Router } from "express";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getPost,
  listPosts,
  toggleReaction,
  updatePost,
} from "../controllers/postController.js";

const router = Router();

router.route("/").get(listPosts).post(createPost);
router.route("/:id").get(getPost).put(updatePost).delete(deletePost);
router.post("/:id/comments", addComment);
router.delete("/:id/comments/:commentId", deleteComment);
router.patch("/:id/reactions", toggleReaction);

export default router;
