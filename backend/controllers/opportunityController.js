import { randomUUID } from "node:crypto";
import { isMongoConnected } from "../config/db.js";
import Candidate from "../models/Candidate.js";
import Company from "../models/Company.js";
import Opportunity from "../models/Opportunity.js";
import { store } from "../store/dataStore.js";
import {
  cleanString,
  validateOpportunity,
} from "../utils/validation.js";

const editableFields = [
  "candidate",
  "company",
  "roleTitle",
  "description",
  "location",
  "workMode",
  "compensation",
  "message",
];

const pickFields = (body) =>
  editableFields.reduce((result, field) => {
    if (body[field] !== undefined) result[field] = cleanString(body[field]);
    return result;
  }, {});

const sendValidationError = (res, errors) =>
  res.status(400).json({ success: false, message: "Please fix the highlighted fields", errors });

const populateSingle = async (opportunity) => {
  if (!opportunity) return null;

  if (isMongoConnected()) {
    const [candidate, company] = await Promise.all([
      typeof opportunity.candidate === "string"
        ? Candidate.findOne({ id: opportunity.candidate }).lean()
        : null,
      typeof opportunity.company === "string"
        ? Company.findOne({ id: opportunity.company }).lean()
        : null,
    ]);

    return {
      ...opportunity,
      candidate: candidate
        ? {
            id: candidate.id,
            name: candidate.name,
            headline: candidate.headline,
            location: candidate.location,
          }
        : opportunity.candidate,
      company: company
        ? {
            id: company.id,
            name: company.name,
            industry: company.industry,
            location: company.location,
          }
        : opportunity.company,
    };
  }

  // Fallback: in-memory store
  const candidate = store.findById("candidates", opportunity.candidate);
  const company = store.findById("companies", opportunity.company);

  return {
    ...opportunity,
    candidate: candidate
      ? {
          id: candidate.id,
          name: candidate.name,
          headline: candidate.headline,
          location: candidate.location,
        }
      : opportunity.candidate,
    company: company
      ? {
          id: company.id,
          name: company.name,
          industry: company.industry,
          location: company.location,
        }
      : opportunity.company,
  };
};

const populateMultiple = async (opportunities) => {
  if (!opportunities.length) return [];

  if (isMongoConnected()) {
    const candidateIds = [...new Set(opportunities.map((o) => o.candidate).filter(Boolean))];
    const companyIds = [...new Set(opportunities.map((o) => o.company).filter(Boolean))];

    const [candidates, companies] = await Promise.all([
      Candidate.find({ id: { $in: candidateIds } }).lean(),
      Company.find({ id: { $in: companyIds } }).lean(),
    ]);

    const candMap = new Map(candidates.map((c) => [c.id, c]));
    const compMap = new Map(companies.map((c) => [c.id, c]));

    return opportunities.map((opp) => {
      const cand = candMap.get(opp.candidate);
      const comp = compMap.get(opp.company);
      return {
        ...opp,
        candidate: cand
          ? {
              id: cand.id,
              name: cand.name,
              headline: cand.headline,
              location: cand.location,
            }
          : opp.candidate,
        company: comp
          ? {
              id: comp.id,
              name: comp.name,
              industry: comp.industry,
              location: comp.location,
            }
          : opp.company,
      };
    });
  }

  return opportunities.map((opp) => {
    const candidate = store.findById("candidates", opp.candidate);
    const company = store.findById("companies", opp.company);
    return {
      ...opp,
      candidate: candidate
        ? {
            id: candidate.id,
            name: candidate.name,
            headline: candidate.headline,
            location: candidate.location,
          }
        : opp.candidate,
      company: company
        ? {
            id: company.id,
            name: company.name,
            industry: company.industry,
            location: company.location,
          }
        : opp.company,
    };
  });
};

const ensureReferences = async (data) => {
  const errors = [];
  if (isMongoConnected()) {
    const [cand, comp] = await Promise.all([
      Candidate.findOne({ id: data.candidate }),
      Company.findOne({ id: data.company }),
    ]);
    if (!cand) errors.push("candidate does not exist");
    if (!comp) errors.push("company does not exist");
  } else {
    if (!store.findById("candidates", data.candidate)) errors.push("candidate does not exist");
    if (!store.findById("companies", data.company)) errors.push("company does not exist");
  }
  return errors;
};

export async function listOpportunities(req, res, next) {
  try {
    const { candidateId, companyId, status } = req.query;

    if (isMongoConnected()) {
      const query = {};
      if (candidateId) query.candidate = candidateId;
      if (companyId) query.company = companyId;
      if (status) query.status = status.toUpperCase();

      const opportunities = await Opportunity.find(query).sort({ createdAt: -1 }).lean();
      const populated = await populateMultiple(opportunities);
      return res.json({ success: true, data: populated });
    }

    let opportunities = store.list("opportunities");
    if (candidateId) {
      opportunities = opportunities.filter((item) => item.candidate === candidateId);
    }
    if (companyId) {
      opportunities = opportunities.filter((item) => item.company === companyId);
    }
    if (status) {
      opportunities = opportunities.filter((item) => item.status === status.toUpperCase());
    }

    opportunities.sort((first, second) => second.createdAt.localeCompare(first.createdAt));
    const populated = await populateMultiple(opportunities);
    return res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export async function getOpportunity(req, res, next) {
  try {
    if (isMongoConnected()) {
      const opp = await Opportunity.findOne({ id: req.params.id }).lean();
      if (!opp) {
        return res.status(404).json({ success: false, message: "Opportunity not found" });
      }
      const populated = await populateSingle(opp);
      return res.json({ success: true, data: populated });
    }

    const opp = store.findById("opportunities", req.params.id);
    if (!opp) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }
    const populated = await populateSingle(opp);
    return res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export async function createOpportunity(req, res, next) {
  try {
    const data = pickFields(req.body);
    const refErrors = await ensureReferences(data);
    const errors = [...validateOpportunity(data), ...refErrors];
    if (errors.length) return sendValidationError(res, errors);

    if (isMongoConnected()) {
      const id = `opportunity-${randomUUID().slice(0, 8)}`;
      const created = await Opportunity.create({
        ...data,
        id,
        status: "PENDING",
        respondedAt: null,
      });
      const populated = await populateSingle(created.toObject());
      return res.status(201).json({ success: true, data: populated });
    }

    const created = store.insert("opportunities", {
      ...data,
      status: "PENDING",
      respondedAt: null,
    });
    const populated = await populateSingle(created);
    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export async function updateOpportunity(req, res, next) {
  try {
    if (isMongoConnected()) {
      const existing = await Opportunity.findOne({ id: req.params.id }).lean();
      if (!existing) {
        return res.status(404).json({ success: false, message: "Opportunity not found" });
      }
      if (existing.status !== "PENDING") {
        return res.status(409).json({
          success: false,
          message: "Only pending opportunities can be edited",
        });
      }

      const data = { ...existing, ...pickFields(req.body) };
      const refErrors = await ensureReferences(data);
      const errors = [...validateOpportunity(data), ...refErrors];
      if (errors.length) return sendValidationError(res, errors);

      const updated = await Opportunity.findOneAndUpdate(
        { id: req.params.id },
        pickFields(data),
        { new: true, runValidators: true },
      ).lean();

      const populated = await populateSingle(updated);
      return res.json({ success: true, data: populated });
    }

    const existing = store.findById("opportunities", req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }
    if (existing.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message: "Only pending opportunities can be edited",
      });
    }

    const data = { ...existing, ...pickFields(req.body) };
    const refErrors = await ensureReferences(data);
    const errors = [...validateOpportunity(data), ...refErrors];
    if (errors.length) return sendValidationError(res, errors);

    const updated = store.update("opportunities", req.params.id, pickFields(data));
    const populated = await populateSingle(updated);
    return res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export async function deleteOpportunity(req, res, next) {
  try {
    if (isMongoConnected()) {
      const deleted = await Opportunity.findOneAndDelete({ id: req.params.id });
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Opportunity not found" });
      }
      return res.status(204).send();
    }

    const deleted = store.remove("opportunities", req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function setStatus(req, res, next, status) {
  try {
    if (isMongoConnected()) {
      const existing = await Opportunity.findOne({ id: req.params.id }).lean();
      if (!existing) {
        return res.status(404).json({ success: false, message: "Opportunity not found" });
      }
      if (existing.status !== "PENDING") {
        return res.status(409).json({
          success: false,
          message: "This opportunity has already been answered",
        });
      }

      const updated = await Opportunity.findOneAndUpdate(
        { id: req.params.id },
        { status, respondedAt: new Date() },
        { new: true },
      ).lean();

      const populated = await populateSingle(updated);
      return res.json({ success: true, data: populated });
    }

    const existing = store.findById("opportunities", req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }
    if (existing.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message: "This opportunity has already been answered",
      });
    }

    const updated = store.update("opportunities", req.params.id, {
      status,
      respondedAt: new Date().toISOString(),
    });

    const populated = await populateSingle(updated);
    return res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
}

export const acceptOpportunity = (req, res, next) => setStatus(req, res, next, "ACCEPTED");
export const declineOpportunity = (req, res, next) => setStatus(req, res, next, "DECLINED");
