/**
 * Shared roster search data and filter logic for header search and Roster Search page.
 */

export type RosterItemType = "provider" | "shift" | "assignment";

export interface RosterProvider {
  id: string;
  name: string;
  role: string;
  facility: string;
  department: string;
  status: string;
}

export interface RosterShift {
  id: string;
  facility: string;
  department: string;
  date: string;
  time: string;
  unit: string;
  status: string;
}

export interface RosterAssignment {
  id: string;
  providerName: string;
  facility: string;
  department: string;
  date: string;
  time: string;
  status: string;
}

export type RosterItem =
  | { type: "provider"; data: RosterProvider }
  | { type: "shift"; data: RosterShift }
  | { type: "assignment"; data: RosterAssignment };

export const rosterProviders: RosterProvider[] = [
  { id: "p1", name: "Sarah Johnson", role: "Provider", facility: "St. Mary's Medical Center", department: "ICU", status: "Active" },
  { id: "p2", name: "Maria Garcia", role: "Coordinator", facility: "St. Mary's Medical Center", department: "Scheduling", status: "Active" },
  { id: "p3", name: "Alex Rivera", role: "Corporate Clinician", facility: "City General Hospital", department: "Emergency", status: "Active" },
  { id: "p4", name: "Jordan Lee", role: "Corporate Contributor", facility: "Memorial Hospital", department: "Med-Surg", status: "Active" },
  { id: "p5", name: "Sam Taylor", role: "Provider", facility: "St. Mary's Medical Center", department: "ICU", status: "Active" },
];

export const rosterShifts: RosterShift[] = [
  { id: "s1", facility: "St. Mary's Medical Center", department: "ICU", date: "Jan 29, 2025", time: "7:00 AM - 3:00 PM", unit: "3 North", status: "Filled" },
  { id: "s2", facility: "City General Hospital", department: "Emergency", date: "Jan 29, 2025", time: "3:00 PM - 11:00 PM", unit: "ED", status: "Open" },
  { id: "s3", facility: "Memorial Hospital", department: "Med-Surg", date: "Jan 31, 2025", time: "7:00 PM - 7:00 AM", unit: "4 West", status: "Open" },
  { id: "s4", facility: "St. Mary's Medical Center", department: "ICU", date: "Feb 1, 2025", time: "7:00 AM - 7:00 PM", unit: "ICU", status: "Filled" },
];

export const rosterAssignments: RosterAssignment[] = [
  { id: "a1", providerName: "Sarah Johnson", facility: "St. Mary's Medical Center", department: "ICU", date: "Jan 29, 2025", time: "7:00 AM - 3:00 PM", status: "Active" },
  { id: "a2", providerName: "Sarah Johnson", facility: "St. Mary's Medical Center", department: "Emergency", date: "Jan 29, 2025", time: "3:00 PM - 11:00 PM", status: "Upcoming" },
  { id: "a3", providerName: "Alex Rivera", facility: "City General Hospital", department: "ICU", date: "Jan 31, 2025", time: "7:00 AM - 7:00 PM", status: "Upcoming" },
];

function matchesQuery(str: string, q: string): boolean {
  return str.toLowerCase().includes(q.toLowerCase());
}

/** selectedTypes: if empty, show all types; otherwise only selected. */
export function filterRoster(query: string, selectedTypes: RosterItemType[]): RosterItem[] {
  const q = query.trim();
  const all = selectedTypes.length === 0;
  const showProviders = all || selectedTypes.includes("provider");
  const showShifts = all || selectedTypes.includes("shift");
  const showAssignments = all || selectedTypes.includes("assignment");

  const items: RosterItem[] = [];

  if (showProviders) {
    const list = q
      ? rosterProviders.filter(
          (p) =>
            matchesQuery(p.name, q) ||
            matchesQuery(p.facility, q) ||
            matchesQuery(p.department, q) ||
            matchesQuery(p.role, q),
        )
      : rosterProviders;
    list.forEach((data) => items.push({ type: "provider", data }));
  }
  if (showShifts) {
    const list = q
      ? rosterShifts.filter(
          (s) =>
            matchesQuery(s.facility, q) ||
            matchesQuery(s.department, q) ||
            matchesQuery(s.unit, q) ||
            matchesQuery(s.status, q),
        )
      : rosterShifts;
    list.forEach((data) => items.push({ type: "shift", data }));
  }
  if (showAssignments) {
    const list = q
      ? rosterAssignments.filter(
          (a) =>
            matchesQuery(a.providerName, q) ||
            matchesQuery(a.facility, q) ||
            matchesQuery(a.department, q) ||
            matchesQuery(a.status, q),
        )
      : rosterAssignments;
    list.forEach((data) => items.push({ type: "assignment", data }));
  }

  return items;
}
