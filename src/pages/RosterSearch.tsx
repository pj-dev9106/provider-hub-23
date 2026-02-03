import { useState, useMemo } from "react";
import {
  Search,
  ChevronRight,
  Mail,
  Phone,
  LayoutDashboard,
  GraduationCap,
  Heart,
  Megaphone,
  FileText,
  AlertCircle,
  Calendar,
  Users,
  BookOpen,
  Zap,
  Link2,
  BookMarked,
  MessageSquare,
  Shield,
  CreditCard,
  ClipboardList,
  UserPlus,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { RosterSearchDrillInSheet } from "@/components/RosterSearchDrillInSheet";
import {
  rosterProviders,
  filterRosterProviders,
  ROSTER_SITES,
  WORK_STATUSES,
  type RosterProvider,
  type WorkStatus,
} from "@/lib/rosterSearch";

// Mock data for Portal sections
const MOCK_ANNOUNCEMENTS = [
  { id: "1", title: "New credentialing portal launch", date: "Jan 28, 2025", type: "Update" },
  { id: "2", title: "Holiday schedule for St. Mary's", date: "Jan 25, 2025", type: "Schedule" },
  { id: "3", title: "HIPAA refresher due by Feb 15", date: "Jan 20, 2025", type: "Compliance" },
];
const MOCK_POSTS = [
  { id: "1", title: "ICU staffing updates — Q1", author: "Scheduling", date: "Jan 27" },
  { id: "2", title: "ED peak hours reminder", author: "ED Lead", date: "Jan 26" },
];
const MOCK_PRIORITY_ITEMS = [
  { id: "1", label: "Complete I-9 verification", due: "Feb 5" },
  { id: "2", label: "License renewal documentation", due: "Feb 10" },
];
const MOCK_EVENTS = [
  { id: "1", title: "Provider orientation", date: "Feb 3", time: "9:00 AM" },
  { id: "2", title: "Credentialing committee meeting", date: "Feb 7", time: "2:00 PM" },
];
const MOCK_CONTACTS = [
  { name: "Credentialing Office", role: "Credentials", email: "credentials@reliashealthcare.com" },
  { name: "Scheduling", role: "Scheduling", email: "scheduling@reliashealthcare.com" },
];

// Mock data for Education
const MOCK_QUICK_LINKS = [
  { label: "NMHS Learning Hub", href: "#" },
  { label: "Policy documents", href: "#" },
  { label: "Compliance training", href: "#" },
];
const MOCK_EDUCATION_POSTS = [
  { id: "1", title: "New EM curriculum available", date: "Jan 28" },
  { id: "2", title: "Teaching our Teachers — Spring cohort", date: "Jan 25" },
];

// Mock data for Benefits
const MOCK_BENEFITS_PLANS = [
  { name: "Medical", status: "Active", plan: "PPO Standard" },
  { name: "Dental", status: "Active", plan: "Basic" },
  { name: "Vision", status: "Active", plan: "Standard" },
];

export default function RosterSearch() {
  const [mainTab, setMainTab] = useState("portal");
  const [query, setQuery] = useState("");
  const [siteFilter, setSiteFilter] = useState<string>("");
  const [workStatusFilter, setWorkStatusFilter] = useState<WorkStatus | "All">("All");
  const [drillInProvider, setDrillInProvider] = useState<RosterProvider | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(
    () =>
      filterRosterProviders(rosterProviders, {
        query: query || undefined,
        site: siteFilter || undefined,
        workStatus: workStatusFilter,
      }),
    [query, siteFilter, workStatusFilter],
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
            Portal, education, and benefits for providers and site coordinators.
          </p>
        </div>

        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-11">
            <TabsTrigger value="portal" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Portal
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="benefits" className="gap-2">
              <Heart className="h-4 w-4" />
              Benefits
            </TabsTrigger>
          </TabsList>

          {/* ——— Portal ——— */}
          <TabsContent value="portal" className="mt-6 space-y-6">
            {/* Search (current provider search) */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search
                </CardTitle>
                <CardDescription>
                  Find providers by site and work status. Filter by Sites and Work Status below.
                </CardDescription>
                <div className="relative mt-4 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, preferred name, email, site..."
                    className="pl-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <div className="min-w-[140px]">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Sites</p>
                    <Select value={siteFilter || "all"} onValueChange={(v) => setSiteFilter(v === "all" ? "" : v)}>
                      <SelectTrigger><SelectValue placeholder="All sites" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All sites</SelectItem>
                        {ROSTER_SITES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Work Status</p>
                    <Tabs value={workStatusFilter} onValueChange={(v) => setWorkStatusFilter(v as WorkStatus | "All")} className="w-full">
                      <TabsList className="flex flex-wrap h-auto gap-1 p-1">
                        <TabsTrigger value="All" className="min-w-[2.5rem]">All</TabsTrigger>
                        {WORK_STATUSES.map((s) => (
                          <TabsTrigger key={s} value={s} className="min-w-[2.5rem]">{s}</TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add to Roster
                  </Button>
                </div>
                {results.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-12 text-center">No providers match the current filters.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider Name</TableHead>
                        <TableHead>Preferred Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Service Lines</TableHead>
                        <TableHead>Sites</TableHead>
                        <TableHead>Work Status</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-16 text-right">Edit</TableHead>
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
                          <TableCell className="text-muted-foreground">{provider.preferredName ?? "—"}</TableCell>
                          <TableCell>{provider.type}</TableCell>
                          <TableCell>{provider.serviceLines.join(", ")}</TableCell>
                          <TableCell>{provider.sites.join(", ")}</TableCell>
                          <TableCell><Badge variant="secondary">{provider.workStatus}</Badge></TableCell>
                          <TableCell className="text-muted-foreground text-sm">{provider.email}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{provider.phone}</TableCell>
                          <TableCell>
                            <Badge variant={provider.status === "Active" ? "default" : provider.status === "Pending" ? "secondary" : "outline"}>
                              {provider.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit provider">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Welcome */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welcome</CardTitle>
                <CardDescription>Your hub for facility updates and quick access.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use Search above to find providers credentialed at your site. Check Announcements and Priority Items for action items and deadlines.
                </p>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Announcements
                </CardTitle>
                <CardDescription>Latest facility and organization updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_ANNOUNCEMENTS.map((a) => (
                    <li key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">{a.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{a.type}</Badge>
                        <span className="text-xs text-muted-foreground">{a.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Posts
                </CardTitle>
                <CardDescription>Recent posts from your facility and teams.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_POSTS.map((p) => (
                    <li key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">{p.title}</span>
                      <span className="text-xs text-muted-foreground">{p.author} · {p.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Priority Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Priority Items
                </CardTitle>
                <CardDescription>Action items and upcoming deadlines.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_PRIORITY_ITEMS.map((item) => (
                    <li key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm">{item.label}</span>
                      <Badge variant="outline" className="text-xs">Due {item.due}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Meetings and events at your facility.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_EVENTS.map((e) => (
                    <li key={e.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">{e.title}</span>
                      <span className="text-sm text-muted-foreground">{e.date} · {e.time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contacts
                </CardTitle>
                <CardDescription>Key contacts for credentialing, scheduling, and support.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_CONTACTS.map((c, i) => (
                    <li key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.role} · {c.email}</p>
                      </div>
                      <Button variant="ghost" size="sm">Contact</Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ——— Education ——— */}
          <TabsContent value="education" className="mt-6 space-y-6">
            {/* Banner */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <GraduationCap className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Education &amp; NMHS</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Onboarding, course catalog, and teaching resources for providers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Onboarding */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Provider Onboarding
                </CardTitle>
                <CardDescription>New provider onboarding checklist and resources.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete required steps for credentialing and facility access. Track progress in your onboarding dashboard.
                </p>
                <Button variant="outline" asChild>
                  <a href="/onboarding">Go to Onboarding</a>
                </Button>
              </CardContent>
            </Card>

            {/* Education and NMHS Course Catalog */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookMarked className="h-5 w-5" />
                  Education and NMHS Course Catalog
                </CardTitle>
                <CardDescription>Browse required and optional courses.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  HIPAA, safety, and clinical courses. Filter by department and requirement status.
                </p>
                <Button variant="outline">View course catalog</Button>
              </CardContent>
            </Card>

            {/* Action Center */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Action Center
                </CardTitle>
                <CardDescription>Pending training and compliance actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Courses due, attestations, and renewals. Complete items to stay in compliance.
                </p>
                <Button variant="outline">Open Action Center</Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Quick Links
                </CardTitle>
                <CardDescription>Shortcuts to learning and policy resources.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {MOCK_QUICK_LINKS.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="text-sm text-primary hover:underline flex items-center gap-2">
                        <Link2 className="h-3.5 w-3.5" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Teaching our Teachers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Teaching our Teachers
                </CardTitle>
                <CardDescription>Program for educator development and train-the-trainer.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Resources and cohorts for providers who teach or precept. Sign up for the next session.
                </p>
                <Button variant="outline">Learn more</Button>
              </CardContent>
            </Card>

            {/* Education Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Education Posts
                </CardTitle>
                <CardDescription>Updates from the education team.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_EDUCATION_POSTS.map((p) => (
                    <li key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">{p.title}</span>
                      <span className="text-xs text-muted-foreground">{p.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ——— Benefits ——— */}
          <TabsContent value="benefits" className="mt-6 space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Heart className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Benefits</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Your health, dental, vision, and other benefits as a rostered provider.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  My benefits summary
                </CardTitle>
                <CardDescription>Current coverage and plan details.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_BENEFITS_PLANS.map((plan, i) => (
                    <li key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-sm">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">{plan.plan}</p>
                      </div>
                      <Badge variant="secondary">{plan.status}</Badge>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-4">View full benefits</Button>
              </CardContent>
            </Card>

            {/* Open enrollment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Open enrollment
                </CardTitle>
                <CardDescription>Enroll or make changes during open enrollment.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Next open enrollment: March 1–15, 2025. Update dependents, add optional coverage, or switch plans.
                </p>
                <Button variant="outline">Enrollment guide</Button>
              </CardContent>
            </Card>

            {/* Dependents & contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Dependents &amp; life events
                </CardTitle>
                <CardDescription>Manage dependents and report qualifying life events.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add or remove dependents, update contact info, and submit life event changes (marriage, birth, etc.) for benefits.
                </p>
                <Button variant="outline">Manage dependents</Button>
              </CardContent>
            </Card>

            {/* Benefits contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Benefits support
                </CardTitle>
                <CardDescription>HR and benefits contacts for rostered providers.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about eligibility, claims, or plan options? Contact HR Benefits or your facility coordinator.
                </p>
                <Button variant="outline">Contact benefits</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <RosterSearchDrillInSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        provider={drillInProvider}
      />
    </AppLayout>
  );
}
