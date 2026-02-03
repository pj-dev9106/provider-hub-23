import { useState, useMemo, useRef, useEffect } from "react";
import { Bell, Search, LogOut, UserCircle, ChevronDown, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { filterRosterProviders, rosterProviders, type RosterProvider } from "@/lib/rosterSearch";
import { RosterSearchDrillInSheet } from "@/components/RosterSearchDrillInSheet";

export function AppHeader() {
  const { user, activeRole, setActiveRole, signOut } = useAuth();
  const navigate = useNavigate();
  const hasMultipleRoles = (user?.roles?.length ?? 0) > 1;

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [drillInProvider, setDrillInProvider] = useState<RosterProvider | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const rosterResults = useMemo(
    () => filterRosterProviders(rosterProviders, { query: searchQuery || undefined }),
    [searchQuery],
  );

  const handleDrillIn = (provider: RosterProvider) => {
    setDrillInProvider(provider);
    setSearchOpen(false);
    setSheetOpen(true);
  };

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  const handleSignOut = () => {
    signOut();
    navigate("/signin", { replace: true });
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          
          {/* Roster search - custom dropdown so input stays typeable */}
          <div ref={searchContainerRef} className="hidden md:block relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder="Search roster..."
              className="w-full pl-10 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
            />
            {searchOpen && (
              <div className="absolute top-full left-0 mt-1 w-full min-w-[16rem] max-h-[360px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md z-50 flex flex-col">
                <div className="max-h-[300px] overflow-auto p-1">
                  {rosterResults.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6 text-center">No providers found</p>
                  ) : (
                    rosterResults.slice(0, 12).map((provider) => (
                      <div
                        key={provider.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleDrillIn(provider)}
                        onKeyDown={(e) => e.key === "Enter" && handleDrillIn(provider)}
                        className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-secondary/80 cursor-pointer group text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Users className="h-4 w-4 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{provider.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {provider.facility} · {provider.status}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t text-center bg-muted/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary"
                    onClick={() => {
                      setSearchOpen(false);
                      navigate("/roster-search");
                    }}
                  >
                    View full roster →
                  </Button>
                </div>
              </div>
            )}
          </div>

          <RosterSearchDrillInSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            provider={drillInProvider}
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="text-xs">3 new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  <span className="font-medium text-sm">License Expiring Soon</span>
                </div>
                <span className="text-xs text-muted-foreground ml-4">Your RN license expires in 30 days</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium text-sm">New Shift Available</span>
                </div>
                <span className="text-xs text-muted-foreground ml-4">ICU shift on Feb 15, 7am-7pm</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span className="font-medium text-sm">Training Completed</span>
                </div>
                <span className="text-xs text-muted-foreground ml-4">HIPAA Compliance training approved</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-primary text-sm cursor-pointer justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role swap: show when user has multiple roles */}
          {user && hasMultipleRoles && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="max-w-[120px] truncate">{activeRole ?? user.roles?.[0]}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Acting as (role)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.roles?.map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => {
                      setActiveRole(r);
                      navigate("/", { replace: true });
                    }}
                  >
                    {r}
                    {(activeRole ?? user.roles?.[0]) === r && (
                      <span className="ml-auto text-primary text-xs">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Quick clock in */}
          <Button size="sm" className="hidden sm:flex bg-gradient-primary hover:opacity-90 transition-opacity">
            Clock In
          </Button>

          {/* User menu & Sign out */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {user.displayName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
