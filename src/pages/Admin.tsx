import {
  ShieldCheck,
  Users,
  Building2,
  FileCheck,
  Settings,
  UserCog,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";

const adminSections = [
  {
    title: "User management",
    description: "Manage users, roles, and permissions across the organization.",
    icon: Users,
    href: "#",
    badge: "Coming soon",
  },
  {
    title: "Facilities & locations",
    description: "Configure facilities, departments, and location settings.",
    icon: Building2,
    href: "#",
    badge: "Coming soon",
  },
  {
    title: "Compliance & credentials",
    description: "Organization-wide credential tracking and compliance reports.",
    icon: FileCheck,
    href: "#",
    badge: "Coming soon",
  },
  {
    title: "Organization settings",
    description: "Billing, integrations, and global portal settings.",
    icon: Settings,
    href: "#",
    badge: "Coming soon",
  },
];

export default function Admin() {
  const { activeRole } = useAuth();
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Admin</h1>
            <p className="text-muted-foreground mt-1">
              Organization and user administration (Corporate Admin, Clinician, or Contributor)
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            {activeRole ?? "Admin"}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Administration</CardTitle>
            <CardDescription>
              Manage users, facilities, compliance, and organization settings. These sections are
              available to Corporate Admin role only.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.title} className="card-interactive border">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{section.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {section.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                        <Button variant="ghost" size="sm" className="mt-2 h-auto p-0 text-primary">
                          Open <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <UserCog className="h-5 w-5 shrink-0" />
              <p>
                Role-based access is enforced. Only users with <strong className="text-foreground">Corporate Admin</strong>,{" "}
                <strong className="text-foreground">Corporate Clinician</strong>, or{" "}
                <strong className="text-foreground">Corporate Contributor</strong> can view this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
