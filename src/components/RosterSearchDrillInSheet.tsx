import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin } from "lucide-react";
import type { RosterProvider } from "@/lib/rosterSearch";

interface RosterSearchDrillInSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: RosterProvider | null;
}

export function RosterSearchDrillInSheet({
  open,
  onOpenChange,
  provider,
}: RosterSearchDrillInSheetProps) {
  if (!provider) return null;

  const p = provider;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{p.name}</SheetTitle>
          <SheetDescription>
            {p.preferredName && `Preferred name: ${p.preferredName}. `}
            Provider details
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 pt-4">
          {p.preferredName && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Preferred Name</span>
              <span className="text-sm font-medium">{p.preferredName}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Type</span>
            <span className="text-sm font-medium">{p.type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Service Lines</span>
            <span className="text-sm font-medium">{p.serviceLines.join(", ")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sites</span>
            <span className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              {p.sites.join(", ")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Work Status</span>
            <Badge variant="secondary">{p.workStatus}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={p.status === "Active" ? "default" : p.status === "Pending" ? "secondary" : "outline"}>
              {p.status}
            </Badge>
          </div>
          <div className="pt-2 border-t space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Contact</p>
            <a
              href={`mailto:${p.email}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {p.email}
            </a>
            <a
              href={`tel:${p.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {p.phone}
            </a>
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <a href="/profile">View full profile</a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
