import { randomUUID } from "node:crypto";
import { isMongoConnected } from "../config/db.js";
import Candidate from "../models/Candidate.js";
import Opportunity from "../models/Opportunity.js";
import { store } from "../store/dataStore.js";
import {
  cleanExperience,
  cleanProjects,
  cleanString,
  cleanStringList,
  validateCandidate,
} from "../utils/validation.js";

const fields = [
  "name",
  "headline",
  "about",
  "skills",
  "education",
  "location",
  "preferredWorkMode",
  "preferredRoles",
  "availability",
  "portfolioUrl",
  "githubUrl",
  "profilePhotoUrl",
  "coverPhotoUrl",
  "pronouns",
  "experience",
  "projects",
  "featuredPostIds",
];

const pickFields = (body) =>
  fields.reduce((result, field) => {
    if (body[field] !== undefined) {
      if (field === "experience") {
        result[field] = cleanExperience(body[field]).map((item) => ({
          ...item,
          id: item.id || `experience-${randomUUID().slice(0, 8)}`,
        }));
      } else if (field === "projects") {
        result[field] = cleanProjects(body[field]).map((item) => ({
          ...item,
          id: item.id || `project-${randomUUID().slice(0, 8)}`,
        }));
      } else {
        result[field] = Array.isArray(body[field])
          ? cleanStringList(body[field])
          : cleanString(body[field]);
      }
    }
    return result;
  }, {});

const sendValidationError = (res, errors) =>
  res.status(400).json({ success: false, message: "Please fix the highlighted fields", errors });

export async function listCandidates(req, res, next) {
  try {
    const { skill, role, location } = req.query;

    if (isMongoConnected()) {
      const query = {};
      if (skill) query.skills = { $regex: skill, $options: "i" };
      if (role) query.preferredRoles = { $regex: role, $options: "i" };
      if (location) query.location = { $regex: location, $options: "i" };

      const candidates = await Candidate.find(query).lean();
      return res.json({ success: true, data: candidates });
    }

    // Fallback: in-memory store
    let candidates = store.list("candidates");
    if (skill) {
      const query = skill.toLowerCase();
      candidates = candidates.filter((candidate) =>
        candidate.skills.some((item) => item.toLowerCase().includes(query)),
      );
    }
    if (role) {
      const query = role.toLowerCase();
      candidates = candidates.filter((candidate) =>
        candidate.preferredRoles.some((item) => item.toLowerCase().includes(query)),
      );
    }
    if (location) {
      const query = location.toLowerCase();
      candidates = candidates.filter((candidate) =>
        candidate.location.toLowerCase().includes(query),
      );
    }

    return res.json({ success: true, data: candidates });
  } catch (error) {
    next(error);
  }
}

export async function getCandidate(req, res, next) {
  try {
    if (isMongoConnected()) {
      const candidate = await Candidate.findOne({ id: req.params.id }).lean();
      if (!candidate) {
        return res.status(404).json({ success: false, message: "Candidate not found" });
      }
      return res.json({ success: true, data: candidate });
    }

    const candidate = store.findById("candidates", req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }
    return res.json({ success: true, data: candidate });
  } catch (error) {
    next(error);
  }
}

export async function createCandidate(req, res, next) {
  try {
    const data = {
      experience: [],
      projects: [],
      featuredPostIds: [],
      ...pickFields(req.body),
    };
    const errors = validateCandidate(data);
    if (errors.length) return sendValidationError(res, errors);

    if (isMongoConnected()) {
      const id = `candidate-${randomUUID().slice(0, 8)}`;
      const candidate = await Candidate.create({ ...data, id });
      return res.status(201).json({ success: true, data: candidate });
    }

    return res.status(201).json({ success: true, data: store.insert("candidates", data) });
  } catch (error) {
    next(error);
  }
}

export async function updateCandidate(req, res, next) {
  try {
    if (isMongoConnected()) {
      const existing = await Candidate.findOne({ id: req.params.id }).lean();
      if (!existing) {
        return res.status(404).json({ success: false, message: "Candidate not found" });
      }

      const data = { ...existing, ...pickFields(req.body) };
      const errors = validateCandidate(data);
      if (errors.length) return sendValidationError(res, errors);

      const updated = await Candidate.findOneAndUpdate(
        { id: req.params.id },
        pickFields(data),
        { new: true, runValidators: true },
      ).lean();

      return res.json({ success: true, data: updated });
    }

    const existing = store.findById("candidates", req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    const data = { ...existing, ...pickFields(req.body) };
    const errors = validateCandidate(data);
    if (errors.length) return sendValidationError(res, errors);

    return res.json({
      success: true,
      data: store.update("candidates", req.params.id, pickFields(data)),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCandidate(req, res, next) {
  try {
    if (isMongoConnected()) {
      const deleted = await Candidate.findOneAndDelete({ id: req.params.id });
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Candidate not found" });
      }

      await Opportunity.deleteMany({ candidate: req.params.id });
      return res.status(204).send();
    }

    const deleted = store.remove("candidates", req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    store
      .list("opportunities")
      .filter((opportunity) => opportunity.candidate === req.params.id)
      .forEach((opportunity) => store.remove("opportunities", opportunity.id));

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
