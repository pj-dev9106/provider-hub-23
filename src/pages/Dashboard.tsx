import { 
  Clock, 
  Calendar, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  FileCheck, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Play,
  MapPin,
  BarChart3,
  Building2,
  ShieldCheck,
  UserPlus,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES } from "@/lib/roles";

// Mock data
const kpiData = [
  { 
    title: "Hours This Week", 
    value: "36.5", 
    unit: "hrs",
    change: "+4.5",
    trend: "up",
    icon: Clock,
    color: "text-primary"
  },
  { 
    title: "Patients Seen", 
    value: "24", 
    unit: "patients",
    change: "+8",
    trend: "up",
    icon: Users,
    color: "text-info"
  },
  { 
    title: "Upcoming Shifts", 
    value: "5", 
    unit: "shifts",
    change: "-2",
    trend: "down",
    icon: Calendar,
    color: "text-accent"
  },
  { 
    title: "Earnings (MTD)", 
    value: "$4,280", 
    unit: "",
    change: "+12%",
    trend: "up",
    icon: DollarSign,
    color: "text-success"
  },
];

const todayShifts = [
  {
    id: 1,
    department: "ICU",
    location: "St. Mary's Medical Center",
    time: "7:00 AM - 3:00 PM",
    status: "current",
    patients: 4,
  },
  {
    id: 2,
    department: "Emergency",
    location: "St. Mary's Medical Center", 
    time: "3:00 PM - 11:00 PM",
    status: "upcoming",
    patients: null,
  },
];

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "RN License Expiring",
    description: "Your nursing license expires in 30 days",
    action: "Renew Now",
  },
  {
    id: 2,
    type: "info",
    title: "New Training Available",
    description: "COVID-19 Protocol Update - Required by Feb 28",
    action: "Start Training",
  },
  {
    id: 3,
    type: "success",
    title: "Timesheet Approved",
    description: "Week of Jan 20-26 has been approved",
    action: "View",
  },
];

const recentMessages = [
  {
    id: 1,
    from: "Dr. Michael Chen",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    message: "Can you cover the afternoon shift tomorrow?",
    time: "10 min ago",
    unread: true,
  },
  {
    id: 2,
    from: "HR Department",
    avatar: null,
    message: "Your background check has been completed successfully.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    from: "Scheduling Team",
    avatar: null,
    message: "Your shift swap request has been approved.",
    time: "3 hours ago",
    unread: false,
  },
];

// Weekly hours for chart (last 6 weeks)
const weeklyHoursData = [
  { week: "Dec 16", hours: 32, weekLabel: "Week of Dec 16" },
  { week: "Dec 23", hours: 28, weekLabel: "Week of Dec 23" },
  { week: "Dec 30", hours: 36, weekLabel: "Week of Dec 30" },
  { week: "Jan 6", hours: 34, weekLabel: "Week of Jan 6" },
  { week: "Jan 13", hours: 38, weekLabel: "Week of Jan 13" },
  { week: "Jan 20", hours: 36.5, weekLabel: "Week of Jan 20 (current)" },
];

const hoursChartConfig = {
  hours: { label: "Hours", color: "hsl(var(--primary))" },
  week: { label: "Week" },
};

// Coordinator dashboard mock data
const coordinatorKpis = [
  { title: "Open Shifts", value: "12", unit: "today", icon: Calendar, color: "text-accent" },
  { title: "Coverage Gaps", value: "3", unit: "shifts", icon: AlertTriangle, color: "text-warning" },
  { title: "Assignments to Fill", value: "8", unit: "this week", icon: ClipboardList, color: "text-primary" },
  { title: "Active Providers", value: "42", unit: "online", icon: Users, color: "text-success" },
];
const openShiftsCoord = [
  { id: 1, facility: "St. Mary's", department: "ICU", time: "7:00 AM - 3:00 PM", date: "Today" },
  { id: 2, facility: "City General", department: "ED", time: "3:00 PM - 11:00 PM", date: "Today" },
  { id: 3, facility: "Memorial", department: "Med-Surg", time: "7:00 PM - 7:00 AM", date: "Tomorrow" },
];

// Corporate Admin dashboard mock data
const adminKpis = [
  { title: "Total Providers", value: "248", unit: "active", icon: Users, color: "text-primary" },
  { title: "Facilities", value: "12", unit: "locations", icon: Building2, color: "text-info" },
  { title: "Compliance Rate", value: "94%", unit: "org-wide", icon: ShieldCheck, color: "text-success" },
  { title: "Pending Onboarding", value: "7", unit: "new", icon: UserPlus, color: "text-accent" },
];

export default function Dashboard() {
  const { user, activeRole } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] ?? "there";
  const role = activeRole ?? user?.roles?.[0] ?? ROLES.Provider;

  // Coordinator dashboard (Coordinator or Corporate Contributor)
  if (role === ROLES.Coordinator || role === ROLES.CorporateContributor) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Hi, {firstName}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Scheduling and coverage overview
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/schedule">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Link>
              </Button>
              <Button size="sm" className="bg-gradient-primary hover:opacity-90" asChild>
                <Link to="/assignments">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Assignments
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coordinatorKpis.map((kpi) => (
              <Card key={kpi.title} className="card-interactive">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                      <p className="text-2xl font-bold text-foreground">{kpi.value} <span className="text-sm font-normal text-muted-foreground">{kpi.unit}</span></p>
                    </div>
                    <div className={`p-2.5 rounded-xl bg-secondary ${kpi.color}`}>
                      <kpi.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Open shifts</CardTitle>
                <CardDescription>Shifts that need coverage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {openShiftsCoord.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg border bg-secondary/30 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{s.department} — {s.facility}</p>
                      <p className="text-sm text-muted-foreground">{s.date} · {s.time}</p>
                    </div>
                    <Button variant="outline" size="sm">Fill</Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-primary" asChild>
                  <Link to="/assignments">View all open shifts <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today&apos;s coverage</CardTitle>
                <CardDescription>By facility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["St. Mary's Medical Center", "City General Hospital", "Memorial Hospital"].map((f, i) => (
                    <div key={f} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-foreground">{f}</span>
                      <Badge variant="secondary">{i === 0 ? "Filled" : i === 1 ? "2 gaps" : "Filled"}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Corporate Admin dashboard (Admin only; Corporate Clinician/Contributor use provider/coordinator dashboards)
  if (role === ROLES.CorporateAdmin) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Hi, {firstName}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Organization overview and administration
              </p>
            </div>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90" asChild>
              <Link to="/admin">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminKpis.map((kpi) => (
              <Card key={kpi.title} className="card-interactive">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                      <p className="text-2xl font-bold text-foreground">{kpi.value} <span className="text-sm font-normal text-muted-foreground">{kpi.unit}</span></p>
                    </div>
                    <div className={`p-2.5 rounded-xl bg-secondary ${kpi.color}`}>
                      <kpi.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick actions</CardTitle>
                <CardDescription>Administration shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin"><Users className="h-4 w-4 mr-2" /> User management</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin"><Building2 className="h-4 w-4 mr-2" /> Facilities</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin"><FileCheck className="h-4 w-4 mr-2" /> Compliance reports</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent activity</CardTitle>
                <CardDescription>Organization-wide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>3 new providers completed onboarding</p>
                <p>Compliance report generated — 94%</p>
                <p>2 credential expirations this week</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Provider dashboard (default)
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Good morning, {firstName}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your schedule today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
              <Play className="h-4 w-4 mr-2" />
              Clock In
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <Card key={kpi.title} className="card-interactive">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                      {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${kpi.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {kpi.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      <span>{kpi.change} from last week</span>
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl bg-secondary ${kpi.color}`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hours worked trend (last 6 weeks) */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Hours Worked
                </CardTitle>
                <CardDescription>Last 6 weeks — compare your workload over time</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View details <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={hoursChartConfig} className="h-[260px] w-full">
              <BarChart data={weeklyHoursData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={28} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`${value} hrs`, "Hours"]} />} />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]} fill="var(--color-hours)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Today's Schedule</CardTitle>
                  <CardDescription>Wednesday, January 29, 2025</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayShifts.map((shift) => (
                <div 
                  key={shift.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    shift.status === 'current' 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-secondary/50 border-transparent hover:border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{shift.department}</h4>
                        {shift.status === 'current' && (
                          <Badge className="bg-success/10 text-success border-0 text-xs">
                            In Progress
                          </Badge>
                        )}
                        {shift.status === 'upcoming' && (
                          <Badge variant="secondary" className="text-xs">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {shift.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {shift.time}
                        </span>
                      </div>
                      {shift.patients && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <span className="font-medium text-foreground">{shift.patients}</span> patients assigned
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Alerts</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {alerts.length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.type === 'warning' ? 'status-pending' :
                    alert.type === 'success' ? 'status-approved' :
                    'status-info'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-md ${
                      alert.type === 'warning' ? 'bg-warning/20' :
                      alert.type === 'success' ? 'bg-success/20' :
                      'bg-info/20'
                    }`}>
                      {alert.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                      {alert.type === 'success' && <FileCheck className="h-4 w-4" />}
                      {alert.type === 'info' && <MessageSquare className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
                      <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs">
                        {alert.action} →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Messages & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Messages */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Messages</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {recentMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg transition-colors cursor-pointer hover:bg-secondary/50 ${
                    message.unread ? 'bg-secondary/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      {message.avatar && <AvatarImage src={message.avatar} />}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {message.from.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${message.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>
                          {message.from}
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0">{message.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">{message.message}</p>
                    </div>
                    {message.unread && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Credentials Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Credentials Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Compliance</span>
                  <span className="text-sm font-semibold text-primary">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm">RN License</span>
                  <Badge className="status-pending border text-xs">Expiring Soon</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm">BLS Certification</span>
                  <Badge className="status-approved border text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm">HIPAA Training</span>
                  <Badge className="status-approved border text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Background Check</span>
                  <Badge className="status-approved border text-xs">Verified</Badge>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-2">
                Manage Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
