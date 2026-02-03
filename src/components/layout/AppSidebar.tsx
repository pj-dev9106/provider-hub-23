import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Calendar,
  User,
  FileText,
  MessageSquare,
  Clock,
  DollarSign,
  GraduationCap,
  ClipboardList,
  UserPlus,
  Settings,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAccessiblePaths } from "@/lib/roles";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mainNavItems: { title: string; url: string; icon: typeof LayoutDashboard; badge?: number }[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Schedule", url: "/schedule", icon: Calendar },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Documents", url: "/documents", icon: FileText, badge: 2 },
  { title: "Messages", url: "/messages", icon: MessageSquare, badge: 3 },
];

const secondaryNavItems: { title: string; url: string; icon: typeof Clock }[] = [
  { title: "Roster", url: "/roster-search", icon: Search },
  { title: "Time & Attendance", url: "/time", icon: Clock },
  { title: "Payments", url: "/payments", icon: DollarSign },
  { title: "Training", url: "/training", icon: GraduationCap },
  { title: "Assignments", url: "/assignments", icon: ClipboardList },
];

const otherNavItems: { title: string; url: string; icon: typeof UserPlus }[] = [
  { title: "Onboarding", url: "/onboarding", icon: UserPlus },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

const adminNavItem = { title: "Admin", url: "/admin", icon: ShieldCheck };

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [secondaryOpen, setSecondaryOpen] = useState(true);
  const { user, activeRole } = useAuth();
  const accessiblePaths = useMemo(() => getAccessiblePaths(activeRole ?? undefined), [activeRole]);

  const isActive = (path: string) => location.pathname === path;
  const canView = (url: string) => accessiblePaths.has(url);
  const showAdmin = activeRole
    ? ["Corporate Admin", "Corporate Clinician", "Corporate Contributor"].includes(activeRole)
    : false;

  const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          end={item.url === "/"}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            isActive(item.url) && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          )}
          activeClassName=""
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 font-medium">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="bg-sidebar-primary/20 text-sidebar-primary text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[70px]" : "w-64"
      )}
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-sidebar-foreground truncate">CareShift</h1>
              <p className="text-xs text-sidebar-muted truncate">Roster</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-muted text-xs font-semibold uppercase tracking-wider mb-2 px-3">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.filter((item) => canView(item.url)).map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation - Collapsible */}
        <SidebarGroup className="mt-6">
          <Collapsible open={secondaryOpen} onOpenChange={setSecondaryOpen}>
            {!collapsed && (
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 mb-2 group">
                <span className="text-sidebar-muted text-xs font-semibold uppercase tracking-wider">
                  Work
                </span>
                <ChevronDown className={cn(
                  "h-4 w-4 text-sidebar-muted transition-transform duration-200",
                  secondaryOpen && "rotate-180"
                )} />
              </CollapsibleTrigger>
            )}
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {secondaryNavItems.filter((item) => canView(item.url)).map((item) => (
                    <NavItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Admin - Corporate Admin only */}
        {showAdmin && (
          <SidebarGroup className="mt-6">
            {!collapsed && (
              <SidebarGroupLabel className="text-sidebar-muted text-xs font-semibold uppercase tracking-wider mb-2 px-3">
                Administration
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <NavItem key={adminNavItem.title} item={adminNavItem} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Other Navigation */}
        <SidebarGroup className="mt-6">
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-muted text-xs font-semibold uppercase tracking-wider mb-2 px-3">
              Other
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {otherNavItems.filter((item) => canView(item.url)).map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - User Profile */}
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer",
          collapsed && "justify-center"
        )}>
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
              {user?.displayName?.split(" ").map((n) => n[0]).join("") ?? "?"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && user && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.displayName}</p>
              <p className="text-xs text-sidebar-muted truncate">{activeRole ?? user.roles?.[0] ?? "—"}</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
