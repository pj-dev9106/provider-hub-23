import { useNavigate, useLocation } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Unauthorized() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from as string | undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-xl">Access denied</CardTitle>
              <CardDescription>
                You don't have permission to view this page.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your role does not have access to {from ? `"${from}"` : "this resource"}. If you
            believe this is an error, contact your administrator.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/")} className="gap-2">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Button>
            {from && (
              <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
