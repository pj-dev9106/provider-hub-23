/**
 * Roster search: providers by site and work status.
 * Filter by Sites (BMHC, CMC, DCH, FH, FMOLHS, HKH, MCHS, NMHS) and Work Status (FT, PT, PRN, LOC, IL).
 */

export const ROSTER_SITES = ["BMHC", "CMC", "DCH", "FH", "FMOLHS", "HKH", "MCHS", "NMHS"] as const;
export type RosterSite = (typeof ROSTER_SITES)[number];

export type WorkStatus = "FT" | "PT" | "PRN" | "LOC" | "IL";
export const WORK_STATUSES: WorkStatus[] = ["FT", "PT", "PRN", "LOC", "IL"];

export type ProviderType = "Physician" | "APC";
export const PROVIDER_TYPES: ProviderType[] = ["Physician", "APC"];

/** Provider record/employment status (e.g. Active, Pending) */
export type ProviderStatus = "Active" | "Pending" | "Inactive";
export const PROVIDER_STATUSES: ProviderStatus[] = ["Active", "Pending", "Inactive"];

export interface RosterProvider {
  id: string;
  name: string;
  preferredName?: string;
  type: ProviderType;
  serviceLines: string[];
  sites: string[];
  workStatus: WorkStatus;
  email: string;
  phone: string;
  status: ProviderStatus;
}

export const rosterProviders: RosterProvider[] = [
  {
    id: "p1",
    name: "Sarah Johnson",
    preferredName: "Sarah",
    type: "Physician",
    serviceLines: ["EM"],
    sites: ["NMHS", "FH"],
    workStatus: "FT",
    email: "sarah.johnson@reliashealthcare.com",
    phone: "(555) 201-1001",
    status: "Active",
  },
  {
    id: "p2",
    name: "Maria Garcia",
    preferredName: "Maria",
    type: "APC",
    serviceLines: ["HM"],
    sites: ["NMHS", "MCHS"],
    workStatus: "PT",
    email: "maria.garcia@reliashealthcare.com",
    phone: "(555) 201-1002",
    status: "Active",
  },
  {
    id: "p3",
    name: "Alex Rivera",
    preferredName: "Alex",
    type: "Physician",
    serviceLines: ["EM", "HM"],
    sites: ["NMHS"],
    workStatus: "FT",
    email: "alex.rivera@reliashealthcare.com",
    phone: "(555) 201-1003",
    status: "Active",
  },
  {
    id: "p4",
    name: "Jordan Lee",
    preferredName: "Jordan",
    type: "APC",
    serviceLines: ["EM"],
    sites: ["FH", "CMC"],
    workStatus: "PRN",
    email: "jordan.lee@reliashealthcare.com",
    phone: "(555) 201-1004",
    status: "Active",
  },
  {
    id: "p5",
    name: "Sam Taylor",
    preferredName: "Sam",
    type: "Physician",
    serviceLines: ["HM"],
    sites: ["NMHS", "DCH"],
    workStatus: "FT",
    email: "sam.taylor@reliashealthcare.com",
    phone: "(555) 201-1005",
    status: "Active",
  },
  {
    id: "p6",
    name: "Chris Chen",
    preferredName: "Chris",
    type: "Physician",
    serviceLines: ["EM"],
    sites: ["BMHC", "HKH"],
    workStatus: "PT",
    email: "chris.chen@reliashealthcare.com",
    phone: "(555) 201-1006",
    status: "Active",
  },
  {
    id: "p7",
    name: "Jamie Foster",
    preferredName: "Jamie",
    type: "APC",
    serviceLines: ["HM"],
    sites: ["NMHS"],
    workStatus: "PRN",
    email: "jamie.foster@reliashealthcare.com",
    phone: "(555) 201-1007",
    status: "Pending",
  },
  {
    id: "p8",
    name: "Morgan Wright",
    preferredName: "Morgan",
    type: "Physician",
    serviceLines: ["EM"],
    sites: ["FMOLHS", "MCHS"],
    workStatus: "LOC",
    email: "morgan.wright@reliashealthcare.com",
    phone: "(555) 201-1008",
    status: "Active",
  },
  {
    id: "p9",
    name: "Riley Davis",
    preferredName: "Riley",
    type: "APC",
    serviceLines: ["EM", "HM"],
    sites: ["HKH"],
    workStatus: "IL",
    email: "riley.davis@reliashealthcare.com",
    phone: "(555) 201-1009",
    status: "Active",
  },
];

function matchesQuery(str: string, q: string): boolean {
  return str.toLowerCase().includes(q.toLowerCase());
}

export interface RosterFilters {
  query?: string;
  site?: string;
  workStatus?: WorkStatus | "All";
}

export function filterRosterProviders(
  providers: RosterProvider[],
  filters: RosterFilters,
): RosterProvider[] {
  let list = [...providers];
  const q = (filters.query ?? "").trim();

  if (q) {
    list = list.filter(
      (p) =>
        matchesQuery(p.name, q) ||
        matchesQuery(p.preferredName ?? "", q) ||
        matchesQuery(p.email, q) ||
        matchesQuery(p.phone, q) ||
        p.sites.some((s) => matchesQuery(s, q)) ||
        p.serviceLines.some((s) => matchesQuery(s, q)) ||
        matchesQuery(p.type, q),
    );
  }
  if (filters.site) {
    list = list.filter((p) => p.sites.includes(filters.site!));
  }
  if (filters.workStatus && filters.workStatus !== "All") {
    list = list.filter((p) => p.workStatus === filters.workStatus);
  }
  return list;
}
