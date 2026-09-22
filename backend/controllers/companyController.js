import { randomUUID } from "node:crypto";
import { isMongoConnected } from "../config/db.js";
import Company from "../models/Company.js";
import Opportunity from "../models/Opportunity.js";
import { store } from "../store/dataStore.js";
import { cleanString, validateCompany } from "../utils/validation.js";

const fields = [
  "name",
  "description",
  "industry",
  "location",
  "website",
  "companySize",
];

const pickFields = (body) =>
  fields.reduce((result, field) => {
    if (body[field] !== undefined) result[field] = cleanString(body[field]);
    return result;
  }, {});

const sendValidationError = (res, errors) =>
  res.status(400).json({ success: false, message: "Please fix the highlighted fields", errors });

export async function listCompanies(_req, res, next) {
  try {
    if (isMongoConnected()) {
      const companies = await Company.find().lean();
      return res.json({ success: true, data: companies });
    }

    return res.json({ success: true, data: store.list("companies") });
  } catch (error) {
    next(error);
  }
}

export async function getCompany(req, res, next) {
  try {
    if (isMongoConnected()) {
      const company = await Company.findOne({ id: req.params.id }).lean();
      if (!company) {
        return res.status(404).json({ success: false, message: "Company not found" });
      }
      return res.json({ success: true, data: company });
    }

    const company = store.findById("companies", req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    return res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
}

export async function createCompany(req, res, next) {
  try {
    const data = pickFields(req.body);
    const errors = validateCompany(data);
    if (errors.length) return sendValidationError(res, errors);

    if (isMongoConnected()) {
      const id = `company-${randomUUID().slice(0, 8)}`;
      const company = await Company.create({ ...data, id });
      return res.status(201).json({ success: true, data: company });
    }

    return res.status(201).json({ success: true, data: store.insert("companies", data) });
  } catch (error) {
    next(error);
  }
}

export async function updateCompany(req, res, next) {
  try {
    if (isMongoConnected()) {
      const existing = await Company.findOne({ id: req.params.id }).lean();
      if (!existing) {
        return res.status(404).json({ success: false, message: "Company not found" });
      }

      const data = { ...existing, ...pickFields(req.body) };
      const errors = validateCompany(data);
      if (errors.length) return sendValidationError(res, errors);

      const updated = await Company.findOneAndUpdate(
        { id: req.params.id },
        pickFields(data),
        { new: true, runValidators: true },
      ).lean();

      return res.json({ success: true, data: updated });
    }

    const existing = store.findById("companies", req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const data = { ...existing, ...pickFields(req.body) };
    const errors = validateCompany(data);
    if (errors.length) return sendValidationError(res, errors);

    return res.json({
      success: true,
      data: store.update("companies", req.params.id, pickFields(data)),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCompany(req, res, next) {
  try {
    if (isMongoConnected()) {
      const deleted = await Company.findOneAndDelete({ id: req.params.id });
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Company not found" });
      }

      await Opportunity.deleteMany({ company: req.params.id });
      return res.status(204).send();
    }

    const deleted = store.remove("companies", req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    store
      .list("opportunities")
      .filter((opportunity) => opportunity.company === req.params.id)
      .forEach((opportunity) => store.remove("opportunities", opportunity.id));

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
