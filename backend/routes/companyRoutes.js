import { Router } from "express";
import {
  createCompany,
  deleteCompany,
  getCompany,
  listCompanies,
  updateCompany,
} from "../controllers/companyController.js";

const router = Router();

router.route("/").get(listCompanies).post(createCompany);
router.route("/:id").get(getCompany).put(updateCompany).delete(deleteCompany);

export default router;
