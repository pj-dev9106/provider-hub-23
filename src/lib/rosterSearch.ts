/**
 * Roster: providers and their site relationships.
 * Status and Work Status apply to the provider–site relationship, not the provider.
 * One row per relationship; same provider can appear multiple times (once per site).
 */

export const ROSTER_SITES = ["BMHC", "CMC", "DCH", "FH", "FMOLHS", "HKH", "MCHS", "NMHS"] as const;
export type RosterSite = (typeof ROSTER_SITES)[number];

export type WorkStatus = "FT" | "PT" | "PRN" | "LOC" | "IL";
export const WORK_STATUSES: WorkStatus[] = ["FT", "PT", "PRN", "LOC", "IL"];

/** Relationship status: Active, Benched, Pending (per provider–site) */
export type RelationshipStatus = "Active" | "Benched" | "Pending";
export const RELATIONSHIP_STATUSES: RelationshipStatus[] = ["Active", "Benched", "Pending"];

export type ProviderType = "Physician" | "APC";
export const PROVIDER_TYPES: ProviderType[] = ["Physician", "APC"];

/** Core provider info (no site-specific status) */
export interface RosterProvider {
  id: string;
  name: string;
  preferredName?: string;
  type: ProviderType;
  serviceLines: string[];
  email: string;
  phone: string;
}

/** One provider–site relationship: Status and Work Status apply here */
export interface ProviderSiteRelationship {
  providerId: string;
  site: string;
  workStatus: WorkStatus;
  status: RelationshipStatus;
}

/** One table row = one provider–site relationship (provider details repeated per row) */
export interface RosterRow {
  provider: RosterProvider;
  relationship: ProviderSiteRelationship;
}

// ——— Mock providers (core info only) ———
const rosterProviders: RosterProvider[] = [
  { id: "p1", name: "Sarah Johnson", preferredName: "Sarah", type: "Physician", serviceLines: ["EM"], email: "sarah.johnson@reliashealthcare.com", phone: "(555) 201-1001" },
  { id: "p2", name: "Maria Garcia", preferredName: "Maria", type: "APC", serviceLines: ["HM"], email: "maria.garcia@reliashealthcare.com", phone: "(555) 201-1002" },
  { id: "p3", name: "Alex Rivera", preferredName: "Alex", type: "Physician", serviceLines: ["EM", "HM"], email: "alex.rivera@reliashealthcare.com", phone: "(555) 201-1003" },
  { id: "p4", name: "Jordan Lee", preferredName: "Jordan", type: "APC", serviceLines: ["EM"], email: "jordan.lee@reliashealthcare.com", phone: "(555) 201-1004" },
  { id: "p5", name: "Sam Taylor", preferredName: "Sam", type: "Physician", serviceLines: ["HM"], email: "sam.taylor@reliashealthcare.com", phone: "(555) 201-1005" },
  { id: "p6", name: "Chris Chen", preferredName: "Chris", type: "Physician", serviceLines: ["EM"], email: "chris.chen@reliashealthcare.com", phone: "(555) 201-1006" },
  { id: "p7", name: "Jamie Foster", preferredName: "Jamie", type: "APC", serviceLines: ["HM"], email: "jamie.foster@reliashealthcare.com", phone: "(555) 201-1007" },
  { id: "p8", name: "Morgan Wright", preferredName: "Morgan", type: "Physician", serviceLines: ["EM"], email: "morgan.wright@reliashealthcare.com", phone: "(555) 201-1008" },
  { id: "p9", name: "Riley Davis", preferredName: "Riley", type: "APC", serviceLines: ["EM", "HM"], email: "riley.davis@reliashealthcare.com", phone: "(555) 201-1009" },
];

// ——— Mock relationships (one per provider–site; status/work status per site) ———
const rosterRelationships: ProviderSiteRelationship[] = [
  { providerId: "p1", site: "NMHS", workStatus: "FT", status: "Active" },
  { providerId: "p1", site: "FH", workStatus: "PRN", status: "Pending" },
  { providerId: "p2", site: "NMHS", workStatus: "PT", status: "Active" },
  { providerId: "p2", site: "MCHS", workStatus: "PT", status: "Benched" },
  { providerId: "p3", site: "NMHS", workStatus: "FT", status: "Active" },
  { providerId: "p4", site: "FH", workStatus: "PRN", status: "Active" },
  { providerId: "p4", site: "CMC", workStatus: "PRN", status: "Pending" },
  { providerId: "p5", site: "NMHS", workStatus: "FT", status: "Active" },
  { providerId: "p5", site: "DCH", workStatus: "LOC", status: "Active" },
  { providerId: "p6", site: "BMHC", workStatus: "PT", status: "Active" },
  { providerId: "p6", site: "HKH", workStatus: "PRN", status: "Benched" },
  { providerId: "p7", site: "NMHS", workStatus: "PRN", status: "Pending" },
  { providerId: "p8", site: "FMOLHS", workStatus: "LOC", status: "Active" },
  { providerId: "p8", site: "MCHS", workStatus: "LOC", status: "Active" },
  { providerId: "p9", site: "HKH", workStatus: "IL", status: "Active" },
];

const providerById = new Map(rosterProviders.map((p) => [p.id, p]));

/** All roster rows (one per provider–site relationship); use with filterRosterRows */
export function getRosterRows(): RosterRow[] {
  return rosterRelationships
    .map((rel) => {
      const provider = providerById.get(rel.providerId);
      return provider ? { provider, relationship: rel } : null;
    })
    .filter((r): r is RosterRow => r !== null);
}

/** All relationships for a provider (for drill-in: "where they are active vs pending") */
export function getRelationshipsForProvider(providerId: string): ProviderSiteRelationship[] {
  return rosterRelationships.filter((r) => r.providerId === providerId);
}

export function getProviderById(providerId: string): RosterProvider | undefined {
  return providerById.get(providerId);
}

function matchesQuery(str: string, q: string): boolean {
  return str.toLowerCase().includes(q.toLowerCase());
}

export interface RosterFilters {
  query?: string;
  site?: string;
  workStatus?: WorkStatus | "All";
  status?: RelationshipStatus | "All";
}

export function filterRosterRows(rows: RosterRow[], filters: RosterFilters): RosterRow[] {
  let list = [...rows];
  const q = (filters.query ?? "").trim();

  if (q) {
    list = list.filter(
      (row) =>
        matchesQuery(row.provider.name, q) ||
        matchesQuery(row.provider.preferredName ?? "", q) ||
        matchesQuery(row.provider.email, q) ||
        matchesQuery(row.provider.phone, q) ||
        matchesQuery(row.relationship.site, q) ||
        row.provider.serviceLines.some((s) => matchesQuery(s, q)) ||
        matchesQuery(row.provider.type, q),
    );
  }
  if (filters.site) {
    list = list.filter((row) => row.relationship.site === filters.site);
  }
  if (filters.workStatus && filters.workStatus !== "All") {
    list = list.filter((row) => row.relationship.workStatus === filters.workStatus);
  }
  if (filters.status && filters.status !== "All") {
    list = list.filter((row) => row.relationship.status === filters.status);
  }
  return list;
}
