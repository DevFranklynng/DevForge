export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const defaultBase = import.meta.env.VITE_API_URL || "";

export const api = {
  baseUrl: defaultBase,

  async request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const headers = new Headers(options.headers);
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    let response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    } catch {
      throw new ApiError(0, "Network error — is the DevForge server running?");
    }

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      let details;
      try {
        const body = await response.json();
        if (body.error) message = body.error;
        details = body.details;
      } catch {
        /* no body */
      }
      throw new ApiError(response.status, message, details);
    }

    if (response.status === 204) return undefined;
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  },

  get(path) {
    return this.request(path);
  },

  post(path, body) {
    return this.request(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },

  patch(path, body) {
    return this.request(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },

  put(path, body) {
    return this.request(path, {
      method: "PUT",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },

  delete(path) {
    return this.request(path, { method: "DELETE" });
  },
};