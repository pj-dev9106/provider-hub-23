import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Play,
  Award,
  AlertTriangle,
  ChevronRight,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const requiredTraining = [
  {
    id: 1,
    title: "COVID-19 Protocol Update",
    category: "Infection Control",
    duration: "45 min",
    dueDate: "Feb 28, 2025",
    status: "not-started",
    mandatory: true,
  },
  {
    id: 2,
    title: "HIPAA Privacy Refresher",
    category: "Compliance",
    duration: "30 min",
    dueDate: "Mar 15, 2025",
    status: "in-progress",
    progress: 60,
    mandatory: true,
  },
  {
    id: 3,
    title: "Blood Borne Pathogens",
    category: "Safety",
    duration: "20 min",
    dueDate: "Apr 1, 2025",
    status: "completed",
    completedDate: "Jan 20, 2025",
    mandatory: true,
  },
];

const optionalCourses = [
  {
    id: 101,
    title: "Advanced Cardiac Life Support (ACLS) Review",
    category: "Clinical Skills",
    duration: "2 hours",
    credits: "2 CEUs",
  },
  {
    id: 102,
    title: "Pediatric Emergency Assessment",
    category: "Clinical Skills",
    duration: "1.5 hours",
    credits: "1.5 CEUs",
  },
  {
    id: 103,
    title: "Cultural Competency in Healthcare",
    category: "Professional Development",
    duration: "1 hour",
    credits: "1 CEU",
  },
];

const certifications = [
  { name: "BLS Provider", expires: "Aug 10, 2025", status: "active", credits: "4 CEUs" },
  { name: "ACLS Provider", expires: "Jun 15, 2025", status: "expiring", credits: "8 CEUs" },
  { name: "CCRN Certification", expires: "Oct 20, 2026", status: "active", credits: "100 CEUs" },
];

const policyAcknowledgments = [
  { name: "Code of Conduct", signedDate: "Jan 1, 2025", status: "signed" },
  { name: "Confidentiality Agreement", signedDate: "Jan 1, 2025", status: "signed" },
  { name: "Social Media Policy", signedDate: null, status: "pending" },
];

export default function Training() {
  const completedCount = requiredTraining.filter(t => t.status === 'completed').length;
  const totalRequired = requiredTraining.length;
  const compliancePercent = Math.round((completedCount / totalRequired) * 100);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Training & Compliance</h1>
            <p className="text-muted-foreground mt-1">
              Complete required training and earn continuing education credits
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Compliance Status</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{compliancePercent}%</p>
                  <Progress value={compliancePercent} className="h-1.5 mt-3 w-24" />
                </div>
                <div className="p-2.5 rounded-xl bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Required Training</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{completedCount}/{totalRequired}</p>
                  <p className="text-xs text-muted-foreground mt-2">Completed</p>
                </div>
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">CEUs Earned</p>
                  <p className="text-2xl font-bold text-foreground mt-1">12.5</p>
                  <p className="text-xs text-muted-foreground mt-2">This year</p>
                </div>
                <div className="p-2.5 rounded-xl bg-accent/10">
                  <Award className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Due Soon</p>
                  <p className="text-2xl font-bold text-warning mt-1">2</p>
                  <p className="text-xs text-muted-foreground mt-2">In next 30 days</p>
                </div>
                <div className="p-2.5 rounded-xl bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="required" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="required">Required Training</TabsTrigger>
            <TabsTrigger value="optional">Optional Courses</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="required" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Training Modules</CardTitle>
                <CardDescription>Complete these to maintain compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {requiredTraining.map((training) => (
                  <div 
                    key={training.id}
                    className={`p-4 rounded-xl border transition-all ${
                      training.status === 'not-started' ? 'bg-warning/5 border-warning/20' :
                      training.status === 'in-progress' ? 'bg-primary/5 border-primary/20' :
                      'bg-success/5 border-success/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-foreground">{training.title}</h4>
                          {training.status === 'completed' && (
                            <Badge className="status-approved border">Completed</Badge>
                          )}
                          {training.status === 'in-progress' && (
                            <Badge className="status-info border">In Progress</Badge>
                          )}
                          {training.status === 'not-started' && (
                            <Badge className="status-pending border">Not Started</Badge>
                          )}
                          {training.mandatory && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{training.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {training.duration}
                          </span>
                          {training.status !== 'completed' && (
                            <>
                              <span>•</span>
                              <span className="text-warning">Due: {training.dueDate}</span>
                            </>
                          )}
                          {training.completedDate && (
                            <>
                              <span>•</span>
                              <span className="text-success">Completed: {training.completedDate}</span>
                            </>
                          )}
                        </div>
                        {training.status === 'in-progress' && training.progress && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{training.progress}%</span>
                            </div>
                            <Progress value={training.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm"
                        variant={training.status === 'completed' ? 'outline' : 'default'}
                        className={training.status !== 'completed' ? 'bg-gradient-primary hover:opacity-90' : ''}
                      >
                        {training.status === 'completed' ? (
                          <>Review</>
                        ) : training.status === 'in-progress' ? (
                          <>Continue</>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optional" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Optional Learning</CardTitle>
                <CardDescription>Expand your skills and earn CEUs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {optionalCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{course.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{course.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration}
                          </span>
                          <span>•</span>
                          <span className="text-primary font-medium">{course.credits}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enroll
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {certifications.map((cert) => (
                  <div 
                    key={cert.name}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        cert.status === 'expiring' ? 'bg-warning/10' : 'bg-success/10'
                      }`}>
                        <Award className={`h-5 w-5 ${
                          cert.status === 'expiring' ? 'text-warning' : 'text-success'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">Expires: {cert.expires}</span>
                          <span className="text-xs text-primary font-medium">{cert.credits}</span>
                        </div>
                      </div>
                    </div>
                    {cert.status === 'expiring' ? (
                      <Badge className="status-pending border">Expiring Soon</Badge>
                    ) : (
                      <Badge className="status-approved border">Active</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Policy Acknowledgments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {policyAcknowledgments.map((policy) => (
                  <div 
                    key={policy.name}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        policy.status === 'pending' ? 'bg-warning/10' : 'bg-success/10'
                      }`}>
                        <FileText className={`h-5 w-5 ${
                          policy.status === 'pending' ? 'text-warning' : 'text-success'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{policy.name}</p>
                        {policy.signedDate && (
                          <p className="text-sm text-muted-foreground">Signed: {policy.signedDate}</p>
                        )}
                      </div>
                    </div>
                    {policy.status === 'pending' ? (
                      <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                        Review & Sign
                      </Button>
                    ) : (
                      <Badge className="status-approved border">Signed</Badge>
                    )}
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
