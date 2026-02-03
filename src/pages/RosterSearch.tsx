import { useState, useMemo } from "react";
import { Search, ChevronRight, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppLayout } from "@/components/layout/AppLayout";
import { RosterSearchDrillInSheet } from "@/components/RosterSearchDrillInSheet";
import {
  rosterProviders,
  filterRosterProviders,
  rosterFacilities,
  WORK_STATUSES,
  FACILITY_ASSOCIATIONS,
  PROVIDER_TYPES,
  WORK_TYPES,
  type RosterProvider,
  type WorkStatus,
} from "@/lib/rosterSearch";

export default function RosterSearch() {
  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState<WorkStatus | "All">("All");
  const [facility, setFacility] = useState<string>("");
  const [association, setAssociation] = useState<string>("All");
  const [providerType, setProviderType] = useState<string>("All");
  const [workType, setWorkType] = useState<string>("All");
  const [drillInProvider, setDrillInProvider] = useState<RosterProvider | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(
    () =>
      filterRosterProviders(rosterProviders, {
        query: query || undefined,
        status: statusTab,
        facility: facility || undefined,
        facilityAssociation: association === "All" ? undefined : (association as import("@/lib/rosterSearch").FacilityAssociation),
        providerType: providerType === "All" ? undefined : (providerType as import("@/lib/rosterSearch").ProviderType),
        workType: workType === "All" ? undefined : (workType as import("@/lib/rosterSearch").WorkType),
      }),
    [query, statusTab, facility, association, providerType, workType],
  );

  const handleRowClick = (provider: RosterProvider) => {
    setDrillInProvider(provider);
    setSheetOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Roster</h1>
          <p className="text-muted-foreground mt-1">
            View providers credentialed at your facility. Filter by status, facility, association, provider type, and work type.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>
              Site coordinators can see who is credentialed to work at their site, work status, and contact info.
            </CardDescription>

            <div className="relative mt-4 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, facility, department..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Status</p>
                <Tabs
                  value={statusTab}
                  onValueChange={(v) => setStatusTab(v as WorkStatus | "All")}
                  className="w-full"
                >
                  <TabsList className="flex flex-wrap h-auto gap-1 p-1">
                    <TabsTrigger value="All" className="flex-1 min-w-[4rem]">All</TabsTrigger>
                    {WORK_STATUSES.map((s) => (
                      <TabsTrigger key={s} value={s} className="flex-1 min-w-[4rem]">
                        {s}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Facility</p>
                  <Select value={facility || "all"} onValueChange={(v) => setFacility(v === "all" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All facilities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All facilities</SelectItem>
                      {rosterFacilities.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Association</p>
                  <Select value={association} onValueChange={setAssociation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {FACILITY_ASSOCIATIONS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Provider type</p>
                  <Select value={providerType} onValueChange={setProviderType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {PROVIDER_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Work type</p>
                  <Select value={workType} onValueChange={setWorkType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {WORK_TYPES.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center">No providers match the current filters.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Association</TableHead>
                    <TableHead>Provider type</TableHead>
                    <TableHead>Work type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((provider) => (
                    <TableRow
                      key={provider.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRowClick(provider)}
                      onKeyDown={(e) => e.key === "Enter" && handleRowClick(provider)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{provider.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{provider.facility}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            provider.facilityAssociation === "Active"
                              ? "default"
                              : provider.facilityAssociation === "Backup"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {provider.facilityAssociation}
                        </Badge>
                      </TableCell>
                      <TableCell>{provider.providerType}</TableCell>
                      <TableCell>{provider.workType}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            {provider.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            {provider.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <RosterSearchDrillInSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        provider={drillInProvider}
      />
    </AppLayout>
  );
}
