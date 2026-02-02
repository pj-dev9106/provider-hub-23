import { useState, useMemo } from "react";
import { Search, Users, Calendar, ClipboardList, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/AppLayout";
import { RosterSearchDrillInSheet } from "@/components/RosterSearchDrillInSheet";
import { filterRoster, type RosterItem, type RosterItemType } from "@/lib/rosterSearch";
import { cn } from "@/lib/utils";

const TYPE_OPTIONS: { value: RosterItemType; label: string }[] = [
  { value: "provider", label: "Providers" },
  { value: "shift", label: "Shifts" },
  { value: "assignment", label: "Assignments" },
];

export default function RosterSearch() {
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<RosterItemType[]>([]);
  const [drillInItem, setDrillInItem] = useState<RosterItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(() => filterRoster(query, selectedTypes), [query, selectedTypes]);

  const toggleType = (t: RosterItemType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const handleDrillIn = (item: RosterItem) => {
    setDrillInItem(item);
    setSheetOpen(true);
  };

  const drillInData = drillInItem
    ? { itemType: drillInItem.type, item: drillInItem.data }
    : { itemType: null as RosterItemType | null, item: null };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Roster Search</h1>
          <p className="text-muted-foreground mt-1">
            Search providers, shifts, and assignments — click a result to drill in. Use badges to filter by type, or leave unselected for all.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Search</CardTitle>
            <CardDescription>
              Type to search; optionally filter by type with the badges below.
            </CardDescription>
            <div className="relative mt-4 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, facility, department..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {TYPE_OPTIONS.map((opt) => (
                <Badge
                  key={opt.value}
                  variant={selectedTypes.includes(opt.value) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer text-sm py-1.5 px-3",
                    !selectedTypes.includes(opt.value) && "opacity-80 hover:opacity-100",
                  )}
                  onClick={() => toggleType(opt.value)}
                >
                  {opt.label}
                </Badge>
              ))}
              {selectedTypes.length > 0 && (
                <Badge
                  variant="ghost"
                  className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedTypes([])}
                >
                  Clear filters
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {selectedTypes.length === 0
                ? "Showing all types (Providers, Shifts, Assignments)"
                : `Filtering: ${selectedTypes.map((t) => TYPE_OPTIONS.find((o) => o.value === t)?.label).join(", ")}`}
            </p>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center">No results found</p>
            ) : (
              <div className="space-y-2">
                {results.map((row) => (
                  <div
                    key={`${row.type}-${row.data.id}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleDrillIn(row)}
                    onKeyDown={(e) => e.key === "Enter" && handleDrillIn(row)}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-secondary/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {row.type === "provider" && (
                        <>
                          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                            <Users className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{(row.data as { name: string }).name}</p>
                            <p className="text-sm text-muted-foreground">{(row.data as { role: string }).role} · {(row.data as { department: string }).department} · {(row.data as { facility: string }).facility}</p>
                          </div>
                        </>
                      )}
                      {row.type === "shift" && (
                        <>
                          <div className="p-2 rounded-lg bg-info/10 text-info shrink-0">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{(row.data as { department: string }).department} — {(row.data as { facility: string }).facility}</p>
                            <p className="text-sm text-muted-foreground">{(row.data as { date: string }).date} · {(row.data as { time: string }).time} · {(row.data as { unit: string }).unit}</p>
                          </div>
                        </>
                      )}
                      {row.type === "assignment" && (
                        <>
                          <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0">
                            <ClipboardList className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{(row.data as { providerName: string }).providerName} — {(row.data as { department: string }).department}</p>
                            <p className="text-sm text-muted-foreground">{(row.data as { facility: string }).facility} · {(row.data as { date: string }).date} · {(row.data as { time: string }).time}</p>
                          </div>
                        </>
                      )}
                      <Badge variant="secondary" className="shrink-0 capitalize">
                        {row.type}
                      </Badge>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <RosterSearchDrillInSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        itemType={drillInData.itemType}
        item={drillInData.item}
      />
    </AppLayout>
  );
}
