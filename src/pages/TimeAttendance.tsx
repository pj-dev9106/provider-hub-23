import { useState } from "react";
import { 
  Clock, 
  Calendar, 
  Play, 
  Square, 
  Coffee,
  AlertTriangle,
  CheckCircle,
  Edit,
  ChevronLeft,
  ChevronRight,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const currentShift = {
  department: "ICU",
  location: "St. Mary's Medical Center",
  startTime: "7:00 AM",
  endTime: "3:00 PM",
  clockedIn: "6:58 AM",
  break: { taken: true, duration: "30 min" },
};

const weeklyHours = [
  { day: "Mon", hours: 8, scheduled: 8 },
  { day: "Tue", hours: 8, scheduled: 8 },
  { day: "Wed", hours: 6, scheduled: 8, current: true },
  { day: "Thu", hours: 0, scheduled: 12 },
  { day: "Fri", hours: 0, scheduled: 0 },
  { day: "Sat", hours: 0, scheduled: 8 },
  { day: "Sun", hours: 0, scheduled: 0 },
];

const timesheets = [
  {
    id: 1,
    period: "Jan 20 - Jan 26, 2025",
    hours: 44,
    overtime: 4,
    status: "approved",
    submittedDate: "Jan 27, 2025",
  },
  {
    id: 2,
    period: "Jan 13 - Jan 19, 2025",
    hours: 40,
    overtime: 0,
    status: "approved",
    submittedDate: "Jan 20, 2025",
  },
  {
    id: 3,
    period: "Jan 6 - Jan 12, 2025",
    hours: 38,
    overtime: 0,
    status: "approved",
    submittedDate: "Jan 13, 2025",
  },
  {
    id: 4,
    period: "Jan 27 - Feb 2, 2025",
    hours: 22,
    overtime: 0,
    status: "pending",
    submittedDate: null,
  },
];

const timeEntries = [
  { date: "Jan 29", shift: "ICU - 7:00 AM to 3:00 PM", clockIn: "6:58 AM", clockOut: null, total: "6h 2m", status: "in-progress" },
  { date: "Jan 28", shift: "ICU - 7:00 AM to 3:00 PM", clockIn: "6:55 AM", clockOut: "3:05 PM", total: "8h 10m", status: "complete" },
  { date: "Jan 27", shift: "ICU - 7:00 AM to 3:00 PM", clockIn: "6:52 AM", clockOut: "3:00 PM", total: "8h 8m", status: "complete" },
];

export default function TimeAttendance() {
  const [isClockedIn, setIsClockedIn] = useState(true);
  const totalScheduled = weeklyHours.reduce((acc, d) => acc + d.scheduled, 0);
  const totalWorked = weeklyHours.reduce((acc, d) => acc + d.hours, 0);
  const progressPercent = Math.round((totalWorked / totalScheduled) * 100);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Time & Attendance</h1>
            <p className="text-muted-foreground mt-1">
              Track your hours and manage timesheets
            </p>
          </div>
        </div>

        {/* Current Shift Status */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Current Shift</h2>
                    <Badge className="bg-success/10 text-success border-0">Active</Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {currentShift.department} • {currentShift.location}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1">
                      <Play className="h-4 w-4 text-success" />
                      Clocked in at {currentShift.clockedIn}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="flex items-center gap-1">
                      <Coffee className="h-4 w-4" />
                      {currentShift.break.duration} break taken
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Coffee className="h-4 w-4 mr-2" />
                  Start Break
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => setIsClockedIn(false)}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Clock Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">This Week</CardTitle>
                  <CardDescription>Jan 27 - Feb 2, 2025</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-6">
                {weeklyHours.map((day) => (
                  <div 
                    key={day.day}
                    className={`p-3 rounded-xl text-center ${
                      day.current 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-secondary/50'
                    }`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
                    <p className="text-lg font-bold text-foreground">{day.hours}h</p>
                    <p className="text-xs text-muted-foreground">/ {day.scheduled}h</p>
                    {day.hours > 0 && (
                      <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min((day.hours / day.scheduled) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weekly Progress</span>
                  <span className="text-sm text-muted-foreground">{totalWorked}h / {totalScheduled}h</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground">Hours This Week</p>
                <p className="text-2xl font-bold text-foreground">{totalWorked}h</p>
                <p className="text-sm text-muted-foreground mt-1">of {totalScheduled}h scheduled</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground">Overtime This Week</p>
                <p className="text-2xl font-bold text-foreground">0h</p>
                <p className="text-sm text-success mt-1">Within regular hours</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground">On-Time Rate</p>
                <p className="text-2xl font-bold text-success">99%</p>
                <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="entries" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="entries">Time Entries</TabsTrigger>
            <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Entries</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Request Correction
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {timeEntries.map((entry, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{entry.date}</h4>
                          {entry.status === 'in-progress' ? (
                            <Badge className="bg-success/10 text-success border-0">In Progress</Badge>
                          ) : (
                            <Badge variant="secondary">Complete</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{entry.shift}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-success">
                            <Play className="h-3 w-3" />
                            {entry.clockIn}
                          </span>
                          {entry.clockOut && (
                            <span className="flex items-center gap-1 text-destructive">
                              <Square className="h-3 w-3" />
                              {entry.clockOut}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{entry.total}</p>
                        <p className="text-xs text-muted-foreground">Total time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timesheets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timesheets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {timesheets.map((sheet) => (
                  <div 
                    key={sheet.id}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{sheet.period}</h4>
                          {sheet.status === 'approved' ? (
                            <Badge className="status-approved border">Approved</Badge>
                          ) : (
                            <Badge className="status-pending border">Pending</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{sheet.hours} hours</span>
                          {sheet.overtime > 0 && (
                            <span className="text-warning">+{sheet.overtime}h overtime</span>
                          )}
                          {sheet.submittedDate && (
                            <>
                              <span>•</span>
                              <span>Submitted {sheet.submittedDate}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
