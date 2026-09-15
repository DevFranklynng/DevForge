import { api } from "@/lib/api";

// ---------- Auth ----------

export const authApi = {
  me: () => api.get("/api/auth/me"),
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  logout: () => api.post("/api/auth/logout"),
  sessions: () => api.get("/api/auth/sessions"),
  revokeSession: (id) => api.delete(`/api/auth/sessions/${id}`),
  updateProfile: (data) => api.patch("/api/auth/profile", data),
  changePassword: (data) => api.post("/api/auth/password", data),
};

// ---------- Settings ----------

export const settingsApi = {
  get: () => api.get("/api/settings"),
  update: (data) => api.patch("/api/settings", data),
};

// ---------- Projects ----------

export const projectsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.status && params.status !== "all") qs.set("status", params.status);
    if (params.sort) qs.set("sort", params.sort);
    const q = qs.toString();
    return api.get(`/api/projects${q ? `?${q}` : ""}`);
  },
  get: (id) => api.get(`/api/projects/${id}`),
  create: (data) => api.post("/api/projects", data),
  update: (id, data) => api.patch(`/api/projects/${id}`, data),
  remove: (id) => api.delete(`/api/projects/${id}`),
};

// ---------- Tasks ----------

export const tasksApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.projectId) qs.set("projectId", params.projectId);
    if (params.status && params.status !== "all") qs.set("status", params.status);
    if (params.q) qs.set("q", params.q);
    const q = qs.toString();
    return api.get(`/api/tasks${q ? `?${q}` : ""}`);
  },
  create: (data) => api.post("/api/tasks", data),
  update: (id, data) => api.patch(`/api/tasks/${id}`, data),
  remove: (id) => api.delete(`/api/tasks/${id}`),
};

// ---------- Repositories ----------

export const repositoriesApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.projectId) qs.set("projectId", params.projectId);
    if (params.source) qs.set("source", params.source);
    const q = qs.toString();
    return api.get(`/api/repositories${q ? `?${q}` : ""}`);
  },
  create: (data) => api.post("/api/repositories", data),
  update: (id, data) => api.patch(`/api/repositories/${id}`, data),
  remove: (id) => api.delete(`/api/repositories/${id}`),
};

// ---------- Deployments ----------

export const deploymentsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.projectId) qs.set("projectId", params.projectId);
    if (params.environment) qs.set("environment", params.environment);
    if (params.status) qs.set("status", params.status);
    const q = qs.toString();
    return api.get(`/api/deployments${q ? `?${q}` : ""}`);
  },
  create: (data) => api.post("/api/deployments", data),
  cancel: (id) => api.post(`/api/deployments/${id}/cancel`),
};

// ---------- API docs ----------

export const apisApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.projectId) qs.set("projectId", params.projectId);
    if (params.method) qs.set("method", params.method);
    const q = qs.toString();
    return api.get(`/api/apis${q ? `?${q}` : ""}`);
  },
  create: (data) => api.post("/api/apis", data),
  update: (id, data) => api.patch(`/api/apis/${id}`, data),
  remove: (id) => api.delete(`/api/apis/${id}`),
};

// ---------- Activity ----------

export const activityApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.projectId) qs.set("projectId", params.projectId);
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.offset) qs.set("offset", String(params.offset));
    const q = qs.toString();
    return api.get(`/api/activity${q ? `?${q}` : ""}`);
  },
};

// ---------- Notifications ----------

export const notificationsApi = {
  list: () => api.get("/api/notifications"),
  unreadCount: () => api.get("/api/notifications/unread-count"),
  reconcile: () => api.post("/api/notifications/reconcile"),
  markRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markUnread: (id) => api.patch(`/api/notifications/${id}/unread`),
  markAllRead: () => api.post("/api/notifications/read-all"),
};

// ---------- Dashboard / Search / AI ----------

export const dashboardApi = {
  get: () => api.get("/api/dashboard"),
};

export const searchApi = {
  search: (q) => {
    const qs = new URLSearchParams({ q });
    return api.get(`/api/search?${qs.toString()}`);
  },
};

export const aiApi = {
  ask: (message, projectId) => api.post("/api/ai/ask", { message, projectId }),
};

// ---------- GitHub ----------

export const githubApi = {
  authorize: () => {
    window.location.href = "/api/github/authorize";
  },
  status: () => api.get("/api/github/status"),
  repos: () => api.get("/api/github/repos"),
  disconnect: () => api.post("/api/github/disconnect"),
};