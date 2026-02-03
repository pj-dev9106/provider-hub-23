/**
 * Roster search: providers credentialed at facilities.
 * For Site Coordinators to see who can work at their site (e.g. St. Mary's),
 * with Status, Facility, Association, Provider type, Work type, and contact info.
 */

export type WorkStatus = "Full Time" | "Part Time" | "PRN";
export type FacilityAssociation = "Active" | "Benched" | "Backup";
export type ProviderType = "Physician" | "APC";
export type WorkType = "Medical Director" | "EM Provider" | "HM Provider";

export interface RosterProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** Work status: Full Time, Part Time, PRN */
  status: WorkStatus;
  facility: string;
  /** Relationship to facility: Active, Benched, Backup */
  facilityAssociation: FacilityAssociation;
  providerType: ProviderType;
  workType: WorkType;
  department?: string;
}

export const WORK_STATUSES: WorkStatus[] = ["Full Time", "Part Time", "PRN"];
export const FACILITY_ASSOCIATIONS: FacilityAssociation[] = ["Active", "Benched", "Backup"];
export const PROVIDER_TYPES: ProviderType[] = ["Physician", "APC"];
export const WORK_TYPES: WorkType[] = ["Medical Director", "EM Provider", "HM Provider"];

export const rosterProviders: RosterProvider[] = [
  {
    id: "p1",
    name: "Sarah Johnson",
    email: "sarah.johnson@reliashealthcare.com",
    phone: "(555) 201-1001",
    status: "Full Time",
    facility: "St. Mary's Medical Center",
    facilityAssociation: "Active",
    providerType: "Physician",
    workType: "EM Provider",
    department: "Emergency",
  },
  {
    id: "p2",
    name: "Maria Garcia",
    email: "maria.garcia@reliashealthcare.com",
    phone: "(555) 201-1002",
    status: "Part Time",
    facility: "St. Mary's Medical Center",
    facilityAssociation: "Active",
    providerType: "APC",
    workType: "HM Provider",
    department: "Hospital Medicine",
  },
  {
    id: "p3",
    name: "Alex Rivera",
    email: "alex.rivera@reliashealthcare.com",
    phone: "(555) 201-1003",
    status: "Full Time",
    facility: "St. Mary's Medical Center",
    facilityAssociation: "Active",
    providerType: "Physician",
    workType: "Medical Director",
    department: "ICU",
  },
  {
    id: "p4",
    name: "Jordan Lee",
    email: "jordan.lee@reliashealthcare.com",
    phone: "(555) 201-1004",
    status: "PRN",
    facility: "St. Mary's Medical Center",
    facilityAssociation: "Backup",
    providerType: "APC",
    workType: "EM Provider",
    department: "Emergency",
  },
  {
    id: "p5",
    name: "Sam Taylor",
    email: "sam.taylor@reliashealthcare.com",
    phone: "(555) 201-1005",
    status: "Full Time",
    facility: "St. Mary's Medical Center",
    facilityAssociation: "Active",
    providerType: "Physician",
    workType: "HM Provider",
    department: "Hospital Medicine",
  },
  {
    id: "p6",
    name: "Chris Chen",
    email: "chris.chen@reliashealthcare.com",
    phone: "(555) 201-1006",
    status: "Part Time",
    facility: "City General Hospital",
    facilityAssociation: "Active",
    providerType: "Physician",
    workType: "EM Provider",
    department: "Emergency",
  },
  {
    id: "p7",
    name: "Jamie Foster",
    email: "jamie.foster@reliashealthcare.com",
    phone: "(555) 201-1007",
    status: "PRN",
    facility: "St. Mary's Medical Center",
    facilityAssociation: "Benched",
    providerType: "APC",
    workType: "HM Provider",
    department: "Hospital Medicine",
  },
  {
    id: "p8",
    name: "Morgan Wright",
    email: "morgan.wright@reliashealthcare.com",
    phone: "(555) 201-1008",
    status: "Full Time",
    facility: "Memorial Hospital",
    facilityAssociation: "Active",
    providerType: "Physician",
    workType: "Medical Director",
    department: "Emergency",
  },
];

/** Unique facilities for filter dropdown */
export const rosterFacilities = Array.from(
  new Set(rosterProviders.map((p) => p.facility).sort()),
);

function matchesQuery(str: string, q: string): boolean {
  return str.toLowerCase().includes(q.toLowerCase());
}

export interface RosterFilters {
  query?: string;
  status?: WorkStatus | "All";
  facility?: string;
  facilityAssociation?: FacilityAssociation | "All";
  providerType?: ProviderType | "All";
  workType?: WorkType | "All";
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
        matchesQuery(p.facility, q) ||
        matchesQuery(p.email, q) ||
        matchesQuery(p.phone, q) ||
        matchesQuery(p.department ?? "", q) ||
        matchesQuery(p.providerType, q) ||
        matchesQuery(p.workType, q),
    );
  }
  if (filters.status && filters.status !== "All") {
    list = list.filter((p) => p.status === filters.status);
  }
  if (filters.facility) {
    list = list.filter((p) => p.facility === filters.facility);
  }
  if (filters.facilityAssociation && filters.facilityAssociation !== "All") {
    list = list.filter((p) => p.facilityAssociation === filters.facilityAssociation);
  }
  if (filters.providerType && filters.providerType !== "All") {
    list = list.filter((p) => p.providerType === filters.providerType);
  }
  if (filters.workType && filters.workType !== "All") {
    list = list.filter((p) => p.workType === filters.workType);
  }
  return list;
}
