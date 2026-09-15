/**
 * Domain model documentation for DevForge.
 *
 * These JSDoc typedefs mirror the Prisma schema on the server. They are not
 * enforced at runtime but give editors autocomplete when imported via
 * `import "./types"`.
 *
 * @typedef {("planning"|"development"|"testing"|"live"|"paused"|"archived")} ProjectStatus
 * @typedef {("low"|"medium"|"high"|"critical")} Priority
 * @typedef {("todo"|"in_progress"|"done")} TaskStatus
 * @typedef {("success"|"building"|"failed"|"cancelled")} DeploymentStatus
 * @typedef {("GET"|"POST"|"PUT"|"PATCH"|"DELETE")} HttpMethod
 *
 * @typedef {{
 *   id: string,
 *   name: string,
 *   email: string,
 *   avatarUrl: string|null,
 *   role: string,
 *   createdAt: string,
 *   settings: UserSettings|null,
 * }} User
 *
 * @typedef {{
 *   id: string,
 *   theme: ("dark"|"light"),
 *   workspaceName: string,
 *   defaultProjectView: ("board"|"list"),
 * }} UserSettings
 *
 * @typedef {{
 *   id: string,
 *   name: string,
 *   description: string|null,
 *   status: ProjectStatus,
 *   priority: Priority,
 *   progress: number,
 *   techStack: string[],
 *   repositoryUrl: string|null,
 *   productionUrl: string|null,
 *   imageUrl: string|null,
 *   dueDate: string|null,
 *   lastActivityAt: string,
 *   createdAt: string,
 *   openTasks?: number,
 *   totalTasks?: number,
 * }} Project
 *
 * @typedef {{
 *   id: string,
 *   title: string,
 *   description: string|null,
 *   status: TaskStatus,
 *   priority: Priority,
 *   dueDate: string|null,
 *   projectId: string|null,
 *   project?: { id: string, name: string }|null,
 *   completedAt: string|null,
 *   createdAt: string,
 * }} Task
 *
 * @typedef {{
 *   id: string,
 *   projectId: string|null,
 *   name: string,
 *   owner: string,
 *   branch: string,
 *   visibility: ("private"|"public"),
 *   stars: number,
 *   forks: number,
 *   openIssues: number,
 *   lastCommit: string|null,
 *   url: string|null,
 *   source: ("github"|"demo"|"manual"),
 * }} Repository
 *
 * @typedef {{
 *   id: string,
 *   projectId: string|null,
 *   environment: string,
 *   status: DeploymentStatus,
 *   buildStatus: string|null,
 *   url: string|null,
 *   branch: string,
 *   commit: string|null,
 *   commitMessage: string|null,
 *   provider: string,
 *   durationMs: number|null,
 *   createdAt: string,
 * }} Deployment
 *
 * @typedef {{
 *   id: string,
 *   name: string|null,
 *   method: HttpMethod,
 *   path: string,
 *   description: string|null,
 *   authRequired: boolean,
 *   parameters: Array<{name: string, type: string, required?: boolean, description?: string}>,
 *   requestBody: string|null,
 *   responseExample: string|null,
 *   statusCode: string,
 *   projectId: string|null,
 * }} ApiEndpoint
 *
 * @typedef {{
 *   id: string,
 *   type: string,
 *   description: string,
 *   projectId: string|null,
 *   createdAt: string,
 * }} ActivityItem
 *
 * @typedef {{
 *   id: string,
 *   type: string,
 *   title: string,
 *   message: string|null,
 *   projectId: string|null,
 *   link: string|null,
 *   isRead: boolean,
 *   createdAt: string,
 * }} Notification
 */

export {};