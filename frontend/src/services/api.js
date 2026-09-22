const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || "Something went wrong");
    error.details = payload.errors || [];
    error.status = response.status;
    throw error;
  }

  return payload.data;
}

const withQuery = (path, params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value && value.trim()),
  ).toString();
  return query ? `${path}?${query}` : path;
};

export const api = {
  candidates: {
    list: (filters) => request(withQuery("/candidates", filters)),
    get: (id) => request(`/candidates/${id}`),
    create: (data) => request("/candidates", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) =>
      request(`/candidates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => request(`/candidates/${id}`, { method: "DELETE" }),
  },
  companies: {
    list: () => request("/companies"),
    get: (id) => request(`/companies/${id}`),
    create: (data) => request("/companies", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) =>
      request(`/companies/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => request(`/companies/${id}`, { method: "DELETE" }),
  },
  opportunities: {
    list: (filters) => request(withQuery("/opportunities", filters)),
    get: (id) => request(`/opportunities/${id}`),
    create: (data) =>
      request("/opportunities", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) =>
      request(`/opportunities/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => request(`/opportunities/${id}`, { method: "DELETE" }),
    accept: (id) => request(`/opportunities/${id}/accept`, { method: "PATCH" }),
    decline: (id) => request(`/opportunities/${id}/decline`, { method: "PATCH" }),
  },
  posts: {
    list: (filters) => request(withQuery("/posts", filters)),
    get: (id, viewerId) => request(withQuery(`/posts/${id}`, { viewerId })),
    create: (data) => request("/posts", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) =>
      request(`/posts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id, actorId) =>
      request(withQuery(`/posts/${id}`, { actorId }), { method: "DELETE" }),
    addComment: (id, data) =>
      request(`/posts/${id}/comments`, { method: "POST", body: JSON.stringify(data) }),
    removeComment: (postId, commentId, candidateId) =>
      request(
        withQuery(`/posts/${postId}/comments/${commentId}`, { candidateId }),
        { method: "DELETE" },
      ),
    toggleReaction: (id, data) =>
      request(`/posts/${id}/reactions`, { method: "PATCH", body: JSON.stringify(data) }),
  },
};

export function formatApiError(error) {
  if (error?.details?.length) return error.details.join(". ");
  return error?.message || "Something went wrong. Please try again.";
}
