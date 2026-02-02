import { Link } from "react-router-dom";
import {
  UserPlus,
  User,
  FileText,
  GraduationCap,
  ShieldCheck,
  FileSignature,
  Building2,
  CheckCircle,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/layout/AppLayout";

// Onboarding steps with status and target pages
const onboardingSteps = [
  {
    id: 1,
    title: "Complete your profile",
    description: "Add your contact info, credentials, work history, and preferences.",
    icon: User,
    url: "/profile",
    status: "completed",
    completedDate: "Jan 5, 2025",
  },
  {
    id: 2,
    title: "Upload required documents",
    description: "Licenses, certifications, TB test, vaccination records, and background check.",
    icon: FileText,
    url: "/documents",
    status: "in-progress",
    detail: "4 of 6 documents approved",
  },
  {
    id: 3,
    title: "Complete required training",
    description: "HIPAA, infection control, and facility-specific modules.",
    icon: GraduationCap,
    url: "/training",
    status: "in-progress",
    detail: "2 of 3 courses completed",
  },
  {
    id: 4,
    title: "Compliance & background",
    description: "Background check and compliance verification.",
    icon: ShieldCheck,
    url: "/documents",
    status: "completed",
    completedDate: "Jan 10, 2025",
  },
  {
    id: 5,
    title: "Sign policy acknowledgments",
    description: "Code of conduct, confidentiality, and workplace policies.",
    icon: FileSignature,
    url: "/training",
    status: "pending",
    detail: "2 of 3 signed",
  },
  {
    id: 6,
    title: "Facility orientation",
    description: "Optional: tour and system access for your primary facilities.",
    icon: Building2,
    url: "/help",
    status: "pending",
    detail: "Schedule with HR",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: "Done", className: "bg-success/10 text-success border-success/20" },
  "in-progress": { label: "In progress", className: "bg-info/10 text-info border-info/20" },
  pending: { label: "Not started", className: "bg-muted text-muted-foreground border-border" },
};

export default function Onboarding() {
  const completedCount = onboardingSteps.filter((s) => s.status === "completed").length;
  const totalSteps = onboardingSteps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);
  const allComplete = completedCount === totalSteps;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Onboarding</h1>
            <p className="text-muted-foreground mt-1">
              Complete these steps to get started as a provider
            </p>
          </div>
          {allComplete && (
            <Badge className="bg-success/10 text-success border-success/20 text-sm px-3 py-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              All complete
            </Badge>
          )}
        </div>

        {/* Progress overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <UserPlus className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Overall progress</p>
                  <p className="text-2xl font-bold text-foreground">
                    {completedCount} of {totalSteps} steps complete
                  </p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <Progress value={progressPercent} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">{progressPercent}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Welcome / next step hint when not complete */}
        {!allComplete && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">You're almost there</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Finish the remaining steps below to get full access. Most providers complete
                    onboarding within their first week.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Onboarding steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Onboarding checklist</CardTitle>
            <CardDescription>
              Complete each step to activate your account and start accepting assignments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {onboardingSteps.map((step) => {
              const Icon = step.icon;
              const config = statusConfig[step.status];
              return (
                <Link
                  key={step.id}
                  to={step.url}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-secondary/50 hover:border-primary/20 transition-all group"
                >
                  <div
                    className={`p-2.5 rounded-lg shrink-0 ${
                      step.status === "completed"
                        ? "bg-success/10 text-success"
                        : step.status === "in-progress"
                          ? "bg-info/10 text-info"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{step.title}</p>
                      <Badge variant="outline" className={config?.className ?? ""}>
                        {config?.label ?? step.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                    {step.status === "completed" && step.completedDate && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Completed {step.completedDate}
                      </p>
                    )}
                    {(step.status === "in-progress" || step.status === "pending") && step.detail && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {step.detail}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary shrink-0" />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Help card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Need help with onboarding?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact HR or visit Help & Support for guides and FAQs.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/help">
                  Help & Support <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
