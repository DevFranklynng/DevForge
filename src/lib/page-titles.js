/**
 * Route pathname -> page label, used for both the in-app topbar title and the
 * browser document title. Order matters: more specific patterns come first.
 */
const PAGE_TITLES = [
  { re: /^\/projects\/([^/]+)\/([^/]+)/, title: "Project" },
  { re: /^\/projects\/([^/]+)/, title: "Project" },
  { re: /^\/projects/, title: "Projects" },
  { re: /^\/dashboard/, title: "Dashboard" },
  { re: /^\/tasks/, title: "Tasks" },
  { re: /^\/deployments/, title: "Deployments" },
  { re: /^\/github/, title: "Repositories" },
  { re: /^\/apis/, title: "APIs" },
  { re: /^\/activity/, title: "Activity" },
  { re: /^\/ai/, title: "DevForge AI" },
  { re: /^\/settings/, title: "Settings" },
];

/**
 * Resolves a pathname to its page label, or the default product name.
 * @param {string} path
 * @returns {string}
 */
export function resolvePageTitle(path) {
  const match = PAGE_TITLES.find((t) => t.re.test(path));
  return match ? match.title : "DevForge";
}