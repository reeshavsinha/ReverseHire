import { Router } from "express";
import {
  acceptOpportunity,
  createOpportunity,
  declineOpportunity,
  deleteOpportunity,
  getOpportunity,
  listOpportunities,
  updateOpportunity,
} from "../controllers/opportunityController.js";

const router = Router();

router.route("/").get(listOpportunities).post(createOpportunity);
router.route("/:id").get(getOpportunity).put(updateOpportunity).delete(deleteOpportunity);
router.patch("/:id/accept", acceptOpportunity);
router.patch("/:id/decline", declineOpportunity);

export default router;
