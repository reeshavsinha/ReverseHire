import { randomUUID } from "node:crypto";
import {
  seedCandidates,
  seedCompanies,
  seedOpportunities,
  seedPosts,
} from "../data/seedData.js";

const clone = (value) => JSON.parse(JSON.stringify(value));

const now = () => new Date().toISOString();

const withDates = (record) => ({
  ...record,
  createdAt: record.createdAt ?? now(),
  updatedAt: record.updatedAt ?? now(),
});

const makeId = (prefix) => `${prefix}-${randomUUID().slice(0, 8)}`;

export class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.candidates = seedCandidates.map(withDates);
    this.companies = seedCompanies.map(withDates);
    this.opportunities = seedOpportunities.map(withDates);
    this.posts = seedPosts.map(withDates);
  }

  collection(name) {
    const collections = {
      candidates: this.candidates,
      companies: this.companies,
      opportunities: this.opportunities,
      posts: this.posts,
    };

    if (!collections[name]) {
      throw new Error(`Unknown collection: ${name}`);
    }

    return collections[name];
  }

  list(name) {
    return clone(this.collection(name));
  }

  findById(name, id) {
    const record = this.collection(name).find((item) => item.id === id);
    return record ? clone(record) : null;
  }

  insert(name, data) {
    const record = withDates({
      ...data,
      id: data.id ?? makeId(name.slice(0, -1)),
    });
    this.collection(name).push(record);
    return clone(record);
  }

  update(name, id, data) {
    const records = this.collection(name);
    const index = records.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    records[index] = withDates({
      ...records[index],
      ...data,
      id: records[index].id,
      createdAt: records[index].createdAt,
      updatedAt: now(),
    });

    return clone(records[index]);
  }

  remove(name, id) {
    const records = this.collection(name);
    const index = records.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    records.splice(index, 1);
    return true;
  }
}

export const store = new DataStore();
