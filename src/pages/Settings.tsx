import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Smartphone, 
  Eye,
  Moon,
  LogOut,
  ChevronRight,
  Key,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const deviceSessions = [
  { device: "MacBook Pro", location: "San Francisco, CA", lastActive: "Now", current: true },
  { device: "iPhone 14 Pro", location: "San Francisco, CA", lastActive: "2 hours ago", current: false },
  { device: "Chrome on Windows", location: "New York, NY", lastActive: "3 days ago", current: false },
];

export default function Settings() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences and security
          </p>
        </div>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Security</CardTitle>
            </div>
            <CardDescription>Protect your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-medium">Password</Label>
                </div>
                <p className="text-sm text-muted-foreground">Last changed 90 days ago</p>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-medium">Two-Factor Authentication</Label>
                </div>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-medium">Email Verification</Label>
                </div>
                <p className="text-sm text-success">Verified: sarah.johnson@email.com</p>
              </div>
              <Button variant="ghost" size="sm">Change</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Shift Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified before your shifts</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">New Shift Opportunities</Label>
                <p className="text-sm text-muted-foreground">Be alerted when new shifts are available</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Document Expiration Alerts</Label>
                <p className="text-sm text-muted-foreground">Reminders when credentials are expiring</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Message Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified for new messages</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Email Digest</Label>
                <p className="text-sm text-muted-foreground">Weekly summary of your activity</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Preferences</CardTitle>
            </div>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Language</Label>
                <p className="text-sm text-muted-foreground">Select your preferred language</p>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Time Zone</Label>
                <p className="text-sm text-muted-foreground">Used for scheduling</p>
              </div>
              <Select defaultValue="pst">
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                  <SelectItem value="cst">Central Time (CT)</SelectItem>
                  <SelectItem value="est">Eastern Time (ET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-medium">Dark Mode</Label>
                </div>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Device Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Active Sessions</CardTitle>
            </div>
            <CardDescription>Manage your logged-in devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deviceSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.current && (
                        <span className="text-xs text-success font-medium">Current</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.location} • {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    Sign Out
                  </Button>
                )}
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-4 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out All Other Devices
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Deactivate Account</Label>
                <p className="text-sm text-muted-foreground">Temporarily disable your account</p>
              </div>
              <Button variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10">
                Deactivate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
