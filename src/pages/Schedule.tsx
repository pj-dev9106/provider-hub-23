import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin,
  Filter,
  Calendar as CalendarIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for shifts
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentWeekDates = [26, 27, 28, 29, 30, 31, 1];
const currentMonth = "January 2025";

const shifts = [
  { id: 1, day: 1, department: "ICU", time: "7:00 AM - 3:00 PM", location: "St. Mary's", status: "confirmed" },
  { id: 2, day: 1, department: "Emergency", time: "3:00 PM - 11:00 PM", location: "St. Mary's", status: "confirmed" },
  { id: 3, day: 2, department: "ICU", time: "7:00 AM - 3:00 PM", location: "St. Mary's", status: "confirmed" },
  { id: 4, day: 3, department: "ICU", time: "7:00 AM - 7:00 PM", location: "City General", status: "pending" },
  { id: 5, day: 4, department: "Med-Surg", time: "7:00 PM - 7:00 AM", location: "St. Mary's", status: "confirmed" },
  { id: 6, day: 6, department: "ICU", time: "7:00 AM - 3:00 PM", location: "St. Mary's", status: "available" },
];

const availableShifts = [
  { id: 101, date: "Feb 5", department: "Emergency", time: "3:00 PM - 11:00 PM", location: "City General", rate: "$65/hr" },
  { id: 102, date: "Feb 6", department: "ICU", time: "7:00 AM - 7:00 PM", location: "St. Mary's", rate: "$70/hr" },
  { id: 103, date: "Feb 8", department: "Med-Surg", time: "7:00 PM - 7:00 AM", location: "Memorial Hospital", rate: "$62/hr" },
];

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(3); // Wednesday index
  
  const getDayShifts = (dayIndex: number) => {
    return shifts.filter(s => s.day === dayIndex);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Schedule</h1>
            <p className="text-muted-foreground mt-1">
              Manage your shifts and availability
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Request Time Off
            </Button>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="available">Available Shifts</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            {/* Calendar Navigation */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-semibold">{currentMonth}</h2>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">Today</Button>
                    <Select defaultValue="week">
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Week View */}
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => (
                    <div key={day} className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">{day}</p>
                      <button
                        onClick={() => setSelectedDate(index)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all mx-auto ${
                          selectedDate === index
                            ? 'bg-primary text-primary-foreground'
                            : index === 3 
                              ? 'bg-primary/10 text-primary hover:bg-primary/20'
                              : 'hover:bg-secondary text-foreground'
                        }`}
                      >
                        {currentWeekDates[index]}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Day Schedule Grid */}
                <div className="mt-6 grid grid-cols-7 gap-2 min-h-[300px]">
                  {weekDays.map((_, dayIndex) => {
                    const dayShifts = getDayShifts(dayIndex);
                    return (
                      <div 
                        key={dayIndex} 
                        className={`p-2 rounded-lg min-h-[200px] ${
                          dayIndex === selectedDate ? 'bg-primary/5 ring-1 ring-primary/20' : 'bg-secondary/30'
                        }`}
                      >
                        {dayShifts.length > 0 ? (
                          <div className="space-y-2">
                            {dayShifts.map(shift => (
                              <div 
                                key={shift.id}
                                className={`p-2 rounded-md text-xs cursor-pointer transition-all hover:scale-[1.02] ${
                                  shift.status === 'confirmed' ? 'bg-primary/10 border border-primary/20' :
                                  shift.status === 'pending' ? 'bg-warning/10 border border-warning/20' :
                                  'bg-secondary border border-dashed border-border'
                                }`}
                              >
                                <p className="font-medium text-foreground truncate">{shift.department}</p>
                                <p className="text-muted-foreground truncate">{shift.time.split(' - ')[0]}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                            No shifts
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Day Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {weekDays[selectedDate]}, January {currentWeekDates[selectedDate]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getDayShifts(selectedDate).length > 0 ? (
                  getDayShifts(selectedDate).map(shift => (
                    <div 
                      key={shift.id}
                      className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{shift.department}</h4>
                            <Badge 
                              variant="secondary"
                              className={
                                shift.status === 'confirmed' ? 'status-approved border' :
                                shift.status === 'pending' ? 'status-pending border' :
                                'bg-secondary'
                              }
                            >
                              {shift.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {shift.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {shift.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Swap</Button>
                          <Button variant="outline" size="sm">Details</Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p>No shifts scheduled for this day</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Browse Available Shifts
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Shifts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {shifts.filter(s => s.status !== 'available').map(shift => (
                  <div 
                    key={shift.id}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{shift.department}</h4>
                          <Badge 
                            variant="secondary"
                            className={shift.status === 'confirmed' ? 'status-approved border' : 'status-pending border'}
                          >
                            {shift.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {weekDays[shift.day]}, Jan {currentWeekDates[shift.day]}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {shift.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {shift.location}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Available Shifts</CardTitle>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="icu">ICU</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="medsurg">Med-Surg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableShifts.map(shift => (
                  <div 
                    key={shift.id}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{shift.department}</h4>
                          <Badge className="bg-success/10 text-success border-0">
                            {shift.rate}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{shift.date}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {shift.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {shift.location}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                        Apply
                      </Button>
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
