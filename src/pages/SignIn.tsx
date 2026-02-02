import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Shield,
  ClipboardList,
  Loader2,
  Mail,
  Lock,
  UserPlus,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES, type Role } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: ROLES.Provider, label: "Provider" },
  { value: ROLES.Coordinator, label: "Coordinator" },
  { value: ROLES.CorporateAdmin, label: "Corporate Admin" },
  { value: ROLES.CorporateClinician, label: "Corporate Clinician" },
  { value: ROLES.CorporateContributor, label: "Corporate Contributor" },
];

/** Dual-role preset for demo (e.g. clinician who is also Corporate). */
const DUAL_ROLE_OPTION = {
  label: "Provider + Corporate Admin (dual-role)",
  roles: [ROLES.Provider, ROLES.CorporateAdmin] as Role[],
};

export default function SignIn() {
  const { signInWithMicrosoft, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES.Provider);
  const [useDualRole, setUseDualRole] = useState(false);

  const handleMicrosoftSignIn = async () => {
    await signInWithMicrosoft(useDualRole ? DUAL_ROLE_OPTION.roles : selectedRole);
    navigate("/", { replace: true });
  };

  const handleDemoSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      signInWithMicrosoft(useDualRole ? DUAL_ROLE_OPTION.roles : selectedRole).then(() =>
        navigate("/", { replace: true }),
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Medical portal branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary text-primary-foreground flex-col justify-between p-10 xl:p-14">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
            <Stethoscope className="h-8 w-8" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Roster</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight max-w-md">
            Secure access for healthcare providers
          </h1>
          <p className="text-primary-foreground/90 text-lg max-w-sm">
            Sign in with your organization account to manage shifts, credentials, and schedules.
          </p>
          <ul className="space-y-4 pt-4">
            {[
              { icon: Shield, text: "HIPAA-compliant & secure" },
              { icon: ClipboardList, text: "Credentials & compliance in one place" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-white/90 shrink-0" />
                <span className="text-primary-foreground/95">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-primary-foreground/70">
          Use your Microsoft work or school account to sign in.
        </p>
      </div>

      {/* Right: Sign in / Sign up card */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Stethoscope className="h-7 w-7" />
            </div>
            <span className="text-lg font-semibold text-foreground">Roster</span>
          </div>

          <Card className="border-border shadow-lg shadow-primary/5">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in with your organization account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Demo: role selector */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Demo: sign in as</Label>
                <div className="flex gap-2 flex-wrap">
                  {ROLE_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      type="button"
                      variant={!useDualRole && selectedRole === opt.value ? "default" : "outline"}
                      size="sm"
                      className="flex-1 min-w-[90px]"
                      onClick={() => {
                        setUseDualRole(false);
                        setSelectedRole(opt.value);
                      }}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant={useDualRole ? "default" : "outline"}
                  size="sm"
                  className="w-full mt-1 text-xs"
                  onClick={() => setUseDualRole(true)}
                >
                  {DUAL_ROLE_OPTION.label}
                </Button>
              </div>
              {/* Microsoft Entra (mock) - primary CTA */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-foreground font-medium"
                onClick={handleMicrosoftSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                    </svg>
                    Sign in with Microsoft
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Uses Microsoft Entra ID (Azure AD) for secure single sign-on.
              </p>

              <Separator className="my-4" />

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="mt-4">
                  <form onSubmit={handleDemoSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@organization.com"
                          className="pl-9"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-9"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-primary hover:opacity-90"
                      disabled={isLoading || !email || !password}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Demo: any email/password signs you in as the selected role above.
                  </p>
                </TabsContent>
                <TabsContent value="signup" className="mt-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      New providers are onboarded through your organization. Use{" "}
                      <strong className="text-foreground">Sign in with Microsoft</strong> above
                      with your work account—your admin will have already created your access.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => handleMicrosoftSignIn()}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in with Microsoft"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Demo: use the role selector above to sign in as Provider, Coordinator, or Corporate Admin.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By signing in, you agree to our terms of use and privacy policy. This portal is for
            authorized healthcare providers only.
          </p>
        </div>
      </div>
    </div>
  );
}
