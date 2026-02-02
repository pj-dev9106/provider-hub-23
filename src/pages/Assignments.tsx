import { useState } from "react";
import {
  ClipboardList,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Filter,
  Search,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock assignments data
const assignments = [
  {
    id: 1,
    facility: "St. Mary's Medical Center",
    department: "ICU",
    date: "Jan 29, 2025",
    time: "7:00 AM - 3:00 PM",
    status: "active",
    type: "Scheduled",
    unit: "3 North",
  },
  {
    id: 2,
    facility: "St. Mary's Medical Center",
    department: "Emergency",
    date: "Jan 29, 2025",
    time: "3:00 PM - 11:00 PM",
    status: "upcoming",
    type: "Scheduled",
    unit: "ED",
  },
  {
    id: 3,
    facility: "City General Hospital",
    department: "ICU",
    date: "Jan 31, 2025",
    time: "7:00 AM - 7:00 PM",
    status: "upcoming",
    type: "Scheduled",
    unit: "ICU",
  },
  {
    id: 4,
    facility: "St. Mary's Medical Center",
    department: "Med-Surg",
    date: "Feb 1, 2025",
    time: "7:00 PM - 7:00 AM",
    status: "upcoming",
    type: "Scheduled",
    unit: "4 West",
  },
  {
    id: 5,
    facility: "Memorial Hospital",
    department: "Float Pool",
    date: "Feb 3, 2025",
    time: "7:00 AM - 3:00 PM",
    status: "pending",
    type: "Float",
    unit: "TBD",
  },
  {
    id: 6,
    facility: "St. Mary's Medical Center",
    department: "ICU",
    date: "Jan 28, 2025",
    time: "7:00 AM - 3:00 PM",
    status: "completed",
    type: "Scheduled",
    unit: "3 North",
  },
  {
    id: 7,
    facility: "City General Hospital",
    department: "Emergency",
    date: "Jan 26, 2025",
    time: "3:00 PM - 11:00 PM",
    status: "completed",
    type: "Scheduled",
    unit: "ED",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "In progress", className: "bg-success/10 text-success border-success/20" },
  upcoming: { label: "Upcoming", className: "bg-info/10 text-info border-info/20" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground border-border" },
};

export default function Assignments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = assignments.filter((a) => {
    const matchSearch =
      !search ||
      a.facility.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase()) ||
      a.unit.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const upcomingCount = assignments.filter((a) => a.status === "upcoming" || a.status === "active").length;
  const completedCount = assignments.filter((a) => a.status === "completed").length;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Assignments</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your shift assignments across facilities
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Upcoming</p>
                  <p className="text-2xl font-bold text-foreground">{upcomingCount}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">shifts assigned</p>
                </div>
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Completed (MTD)</p>
                  <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">this month</p>
                </div>
                <div className="p-2.5 rounded-xl bg-success/10 text-success">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Facilities</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-xs text-muted-foreground mt-0.5">active locations</p>
                </div>
                <div className="p-2.5 rounded-xl bg-info/10 text-info">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments list */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg">All assignments</CardTitle>
                <CardDescription>Your scheduled and completed shift assignments</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search facility, unit..."
                    className="pl-9 w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mt-4">
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">In progress</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No assignments found</p>
                  <p className="text-sm mt-1">
                    {search || statusFilter !== "all"
                      ? "Try adjusting your search or filter."
                      : "You don't have any assignments yet."}
                  </p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facility & department</TableHead>
                      <TableHead>Date & time</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[60px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((a) => (
                      <TableRow key={a.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-secondary/50">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{a.facility}</p>
                              <p className="text-sm text-muted-foreground">{a.department}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>{a.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            {a.time}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{a.unit}</TableCell>
                        <TableCell>
                          <span className="text-sm">{a.type}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusConfig[a.status]?.className ?? ""}
                          >
                            {statusConfig[a.status]?.label ?? a.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MapPin className="h-4 w-4 mr-2" />
                                Directions
                              </DropdownMenuItem>
                              {(a.status === "upcoming" || a.status === "pending") && (
                                <DropdownMenuItem className="text-destructive">
                                  Request release
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
