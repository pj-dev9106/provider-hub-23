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
import {
  getRelationshipsForProvider,
  type RosterRow,
} from "@/lib/rosterSearch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RosterSearchDrillInSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: RosterRow | null;
}

export function RosterSearchDrillInSheet({
  open,
  onOpenChange,
  row,
}: RosterSearchDrillInSheetProps) {
  if (!row) return null;

  const p = row.provider;
  const relationships = getRelationshipsForProvider(p.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{p.name}</SheetTitle>
          <SheetDescription>
            {p.preferredName && `Preferred name: ${p.preferredName}. `}
            Provider details — Status and Work Status per site below.
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

          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Site relationships (Active / Benched / Pending)
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8">Site</TableHead>
                  <TableHead className="h-8">Work Status</TableHead>
                  <TableHead className="h-8">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relationships.map((rel) => (
                  <TableRow key={rel.site}>
                    <TableCell className="py-2 font-medium">{rel.site}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="secondary" className="text-xs">{rel.workStatus}</Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant={
                          rel.status === "Active"
                            ? "default"
                            : rel.status === "Pending"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {rel.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
