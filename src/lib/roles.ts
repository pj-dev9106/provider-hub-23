/**
 * Role-based access for Medicaid provider portal.
 * - Provider, Coordinator, Corporate Admin (core).
 * - Corporate Clinician: clinician with corporate/admin access (Provider + Admin).
 * - Corporate Contributor: coordinator with corporate access (Coordinator + Admin).
 * Coordinators are part of Corporate; some clinicians exist as both Provider and Corporate
 * (use multiple roles + role swap in header for dual-role users).
 */

export const ROLES = {
  Provider: "Provider",
  Coordinator: "Coordinator",
  CorporateAdmin: "Corporate Admin",
  CorporateClinician: "Corporate Clinician",
  CorporateContributor: "Corporate Contributor",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

const ALL_NON_ADMIN = [
  ROLES.Provider,
  ROLES.Coordinator,
  ROLES.CorporateAdmin,
  ROLES.CorporateClinician,
  ROLES.CorporateContributor,
] as const;

/** Routes that require specific roles. Paths not listed are denied. */
const ROLE_ROUTES: Record<string, Role[]> = {
  "/": [...ALL_NON_ADMIN],
  "/schedule": [...ALL_NON_ADMIN],
  "/profile": [...ALL_NON_ADMIN],
  "/documents": [...ALL_NON_ADMIN],
  "/messages": [...ALL_NON_ADMIN],
  "/time": [...ALL_NON_ADMIN],
  "/payments": [...ALL_NON_ADMIN],
  "/training": [...ALL_NON_ADMIN],
  "/assignments": [...ALL_NON_ADMIN],
  "/onboarding": [...ALL_NON_ADMIN],
  "/roster-search": [...ALL_NON_ADMIN],
  "/settings": [...ALL_NON_ADMIN],
  "/help": [...ALL_NON_ADMIN],
  "/admin": [ROLES.CorporateAdmin, ROLES.CorporateClinician, ROLES.CorporateContributor],
};

/**
 * Check if a role can access a path.
 * Paths not in ROLE_ROUTES are denied for safety (only explicitly allowed paths work).
 */
export function canAccess(path: string, role: Role | undefined): boolean {
  if (!role) return false;
  // Normalize path (strip trailing slash, use exact match or base)
  const normalized = path.replace(/\/$/, "") || "/";
  const allowed = ROLE_ROUTES[normalized];
  if (!allowed) return false;
  return allowed.includes(role);
}

/** Get all paths a role can access (for nav filtering). */
export function getAccessiblePaths(role: Role | undefined): Set<string> {
  if (!role) return new Set();
  const set = new Set<string>();
  for (const [path, roles] of Object.entries(ROLE_ROUTES)) {
    if (roles.includes(role)) set.add(path);
  }
  return set;
}
