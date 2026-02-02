import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Building, 
  Edit, 
  Camera,
  Star,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock profile data
const profileData = {
  name: "Sarah Johnson",
  title: "Registered Nurse, BSN",
  email: "sarah.johnson@email.com",
  phone: "(555) 123-4567",
  location: "San Francisco, CA",
  joinDate: "March 2022",
  employeeId: "RN-2022-0847",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
  bio: "Experienced ICU nurse with 8+ years in critical care. Passionate about patient outcomes and continuous learning.",
  specialties: ["Critical Care", "Emergency Medicine", "Cardiac Care"],
  languages: ["English", "Spanish"],
  preferredLocations: ["St. Mary's Medical Center", "City General Hospital"],
  preferredDepartments: ["ICU", "Emergency", "Cardiac Care"],
};

const workHistory = [
  {
    id: 1,
    role: "ICU Nurse",
    facility: "St. Mary's Medical Center",
    period: "Mar 2022 - Present",
    type: "Current",
  },
  {
    id: 2,
    role: "Emergency Room Nurse",
    facility: "City General Hospital",
    period: "Jun 2019 - Feb 2022",
    type: "Previous",
  },
  {
    id: 3,
    role: "Med-Surg Nurse",
    facility: "Memorial Hospital",
    period: "Aug 2016 - May 2019",
    type: "Previous",
  },
];

const credentials = [
  { name: "RN License - California", status: "active", expires: "Dec 2025" },
  { name: "BLS Certification", status: "active", expires: "Aug 2025" },
  { name: "ACLS Certification", status: "active", expires: "Jun 2025" },
  { name: "CCRN Certification", status: "active", expires: "Oct 2026" },
];

const stats = [
  { label: "Shifts Completed", value: "284" },
  { label: "Hours Logged", value: "3,408" },
  { label: "Patient Rating", value: "4.9" },
  { label: "On-Time Rate", value: "99%" },
];

export default function Profile() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          {/* Cover/Banner */}
          <div className="h-32 bg-gradient-primary" />
          
          <CardContent className="relative pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-card shadow-lg">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    SJ
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-1 right-1 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              {/* Info */}
              <div className="flex-1 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{profileData.name}</h1>
                    <p className="text-muted-foreground">{profileData.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="status-approved border">Active</Badge>
                      <span className="text-sm text-muted-foreground">ID: {profileData.employeeId}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              {stats.map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="work">Work History</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{profileData.phone}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{profileData.location}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{profileData.joinDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specialties & Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Specialties & Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {profileData.specialties.map(specialty => (
                        <Badge key={specialty} variant="secondary" className="bg-primary/10 text-primary border-0">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.map(lang => (
                        <Badge key={lang} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">About</p>
                    <p className="text-sm">{profileData.bio}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="credentials" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Licenses & Certifications</CardTitle>
                  <Button size="sm" variant="outline">
                    Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {credentials.map(cred => (
                  <div 
                    key={cred.name}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success/10">
                        <Award className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">{cred.name}</p>
                        <p className="text-sm text-muted-foreground">Expires: {cred.expires}</p>
                      </div>
                    </div>
                    <Badge className="status-approved border">Active</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="work" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Work History</CardTitle>
                  <Button size="sm" variant="outline">
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {workHistory.map((job, index) => (
                    <div key={job.id} className="flex gap-4 pb-6 last:pb-0">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${job.type === 'Current' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                        {index < workHistory.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border mt-2" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{job.role}</h4>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {job.facility}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{job.period}</p>
                          </div>
                          {job.type === 'Current' && (
                            <Badge className="status-approved border">Current</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Preferred Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profileData.preferredLocations.map(loc => (
                      <div 
                        key={loc}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                      >
                        <span>{loc}</span>
                        <Star className="h-4 w-4 text-warning" />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Manage Locations
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Preferred Departments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profileData.preferredDepartments.map(dept => (
                      <div 
                        key={dept}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                      >
                        <span>{dept}</span>
                        <Star className="h-4 w-4 text-warning" />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Manage Departments
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
