export const PROJECT_STATUSES = ["planning", "development", "testing", "live", "paused", "archived"];
export const PROJECT_PRIORITIES = ["low", "medium", "high", "critical"];
export const TASK_STATUSES = ["todo", "in_progress", "done"];
export const TASK_PRIORITIES = ["low", "medium", "high", "critical"];
export const DEPLOYMENT_ENVIRONMENTS = ["production", "staging", "preview"];
export const DEPLOYMENT_STATUSES = ["success", "building", "failed", "cancelled"];
export const API_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
export const ACTIVITY_TYPES = [
  "PROJECT_CREATED",
  "PROJECT_UPDATED",
  "PROJECT_STATUS_CHANGED",
  "PROJECT_ARCHIVED",
  "TASK_CREATED",
  "TASK_UPDATED",
  "TASK_COMPLETED",
  "TASK_DELETED",
  "REPOSITORY_CONNECTED",
  "REPOSITORY_UPDATED",
  "DEPLOYMENT_CREATED",
  "DEPLOYMENT_SUCCESS",
  "DEPLOYMENT_FAILED",
  "DEPLOYMENT_CANCELLED",
  "API_ADDED",
  "API_UPDATED",
  "API_DELETED",
  "PROFILE_UPDATED",
  "SETTINGS_UPDATED",
  "NOTIFICATION_OPENED",
];

export const ACTIVITY_LABELS = {
  PROJECT_CREATED: "Project created",
  PROJECT_UPDATED: "Project updated",
  PROJECT_STATUS_CHANGED: "Status changed",
  PROJECT_ARCHIVED: "Project archived",
  TASK_CREATED: "Task created",
  TASK_UPDATED: "Task updated",
  TASK_COMPLETED: "Task completed",
  TASK_DELETED: "Task deleted",
  REPOSITORY_CONNECTED: "Repository connected",
  REPOSITORY_UPDATED: "Repository updated",
  DEPLOYMENT_CREATED: "Deployment started",
  DEPLOYMENT_SUCCESS: "Deployment succeeded",
  DEPLOYMENT_FAILED: "Deployment failed",
  DEPLOYMENT_CANCELLED: "Deployment cancelled",
  API_ADDED: "Endpoint documented",
  API_UPDATED: "Endpoint updated",
  API_DELETED: "Endpoint removed",
  PROFILE_UPDATED: "Profile updated",
  SETTINGS_UPDATED: "Settings updated",
  NOTIFICATION_OPENED: "Notification opened",
};

export const ACTIVITY_TONES = {
  PROJECT_CREATED: "accent",
  PROJECT_UPDATED: "info",
  PROJECT_STATUS_CHANGED: "warning",
  PROJECT_ARCHIVED: "neutral",
  TASK_CREATED: "accent",
  TASK_UPDATED: "info",
  TASK_COMPLETED: "success",
  TASK_DELETED: "danger",
  REPOSITORY_CONNECTED: "accent",
  REPOSITORY_UPDATED: "info",
  DEPLOYMENT_CREATED: "info",
  DEPLOYMENT_SUCCESS: "success",
  DEPLOYMENT_FAILED: "danger",
  DEPLOYMENT_CANCELLED: "neutral",
  API_ADDED: "accent",
  API_UPDATED: "info",
  API_DELETED: "danger",
  PROFILE_UPDATED: "info",
  SETTINGS_UPDATED: "info",
  NOTIFICATION_OPENED: "info",
};