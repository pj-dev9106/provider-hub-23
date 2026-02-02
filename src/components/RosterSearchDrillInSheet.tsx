import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { RosterItemType, RosterProvider, RosterShift, RosterAssignment } from "@/lib/rosterSearch";

interface RosterSearchDrillInSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: RosterItemType | null;
  item: RosterProvider | RosterShift | RosterAssignment | null;
}

export function RosterSearchDrillInSheet({
  open,
  onOpenChange,
  itemType,
  item,
}: RosterSearchDrillInSheetProps) {
  if (!item || !itemType) return null;

  if (itemType === "provider") {
    const p = item as RosterProvider;
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{p.name}</SheetTitle>
            <SheetDescription>Provider details</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge variant="secondary">{p.role}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Facility</span>
              <span className="text-sm font-medium">{p.facility}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Department</span>
              <span className="text-sm font-medium">{p.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className="bg-success/10 text-success border-0">{p.status}</Badge>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <a href="/profile">View full profile</a>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (itemType === "shift") {
    const s = item as RosterShift;
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{s.department} — {s.facility}</SheetTitle>
            <SheetDescription>Shift details</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {s.facility}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date & time</span>
              <span className="text-sm font-medium">{s.date} · {s.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Unit</span>
              <span className="text-sm font-medium">{s.unit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={s.status === "Open" ? "secondary" : "default"}>{s.status}</Badge>
            </div>
            {s.status === "Open" && (
              <Button className="w-full mt-4">Fill shift</Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (itemType === "assignment") {
    const a = item as RosterAssignment;
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Assignment — {a.providerName}</SheetTitle>
            <SheetDescription>Assignment details</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Provider</span>
              <span className="text-sm font-medium">{a.providerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Facility</span>
              <span className="text-sm font-medium">{a.facility}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Department</span>
              <span className="text-sm font-medium">{a.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date & time</span>
              <span className="text-sm font-medium">{a.date} · {a.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="secondary">{a.status}</Badge>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <a href="/assignments">View in Assignments</a>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return null;
}
