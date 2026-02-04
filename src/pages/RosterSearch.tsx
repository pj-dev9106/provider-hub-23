import { useState, useMemo, Fragment } from "react";
import {
  Search,
  ChevronRight,
  Mail,
  Phone,
  LayoutDashboard,
  GraduationCap,
  Heart,
  Megaphone,
  FileText,
  AlertCircle,
  Calendar,
  Users,
  BookOpen,
  Zap,
  Link2,
  BookMarked,
  MessageSquare,
  Shield,
  CreditCard,
  ClipboardList,
  UserPlus,
  Pencil,
  ChevronDown,
  Rows3,
  ListTree,
  Download,
  BarChart3,
  Table2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { AppLayout } from "@/components/layout/AppLayout";
import { RosterSearchDrillInSheet } from "@/components/RosterSearchDrillInSheet";
import { ReportBuilder, type ReportBuilderValue, getCanvasSize, getBlockLayout, type ReportBlock } from "@/components/ReportBuilder";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import {
  getRosterRows,
  filterRosterRows,
  ROSTER_SITES,
  WORK_STATUSES,
  RELATIONSHIP_STATUSES,
  type RosterRow,
  type WorkStatus,
  type RelationshipStatus,
} from "@/lib/rosterSearch";

// Mock data for Portal sections
const MOCK_ANNOUNCEMENTS = [
  { id: "1", title: "New credentialing portal launch", date: "Jan 28, 2025", type: "Update" },
  { id: "2", title: "Holiday schedule for St. Mary's", date: "Jan 25, 2025", type: "Schedule" },
  { id: "3", title: "HIPAA refresher due by Feb 15", date: "Jan 20, 2025", type: "Compliance" },
];
const MOCK_POSTS = [
  { id: "1", title: "ICU staffing updates — Q1", author: "Scheduling", date: "Jan 27" },
  { id: "2", title: "ED peak hours reminder", author: "ED Lead", date: "Jan 26" },
];
const MOCK_PRIORITY_ITEMS = [
  { id: "1", label: "Complete I-9 verification", due: "Feb 5" },
  { id: "2", label: "License renewal documentation", due: "Feb 10" },
];
const MOCK_EVENTS = [
  { id: "1", title: "Provider orientation", date: "Feb 3", time: "9:00 AM" },
  { id: "2", title: "Credentialing committee meeting", date: "Feb 7", time: "2:00 PM" },
];
const MOCK_CONTACTS = [
  { name: "Credentialing Office", role: "Credentials", email: "credentials@reliashealthcare.com" },
  { name: "Scheduling", role: "Scheduling", email: "scheduling@reliashealthcare.com" },
];

// Mock data for Education
const MOCK_QUICK_LINKS = [
  { label: "NMHS Learning Hub", href: "#" },
  { label: "Policy documents", href: "#" },
  { label: "Compliance training", href: "#" },
];
const MOCK_EDUCATION_POSTS = [
  { id: "1", title: "New EM curriculum available", date: "Jan 28" },
  { id: "2", title: "Teaching our Teachers — Spring cohort", date: "Jan 25" },
];

// Mock data for Benefits
const MOCK_BENEFITS_PLANS = [
  { name: "Medical", status: "Active", plan: "PPO Standard" },
  { name: "Dental", status: "Active", plan: "Basic" },
  { name: "Vision", status: "Active", plan: "Standard" },
];

export default function RosterSearch() {
  const [mainTab, setMainTab] = useState("portal");
  const [query, setQuery] = useState("");
  const [siteFilter, setSiteFilter] = useState<string>("");
  const [workStatusFilter, setWorkStatusFilter] = useState<WorkStatus | "All">("All");
  const [statusFilter, setStatusFilter] = useState<RelationshipStatus | "All">("All");
  const [drillInRow, setDrillInRow] = useState<RosterRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  /** "flat" = one row per relationship; "grouped" = one row per provider, expand to see sites */
  const [viewMode, setViewMode] = useState<"flat" | "grouped">("flat");
  const [expandedProviderIds, setExpandedProviderIds] = useState<Set<string>>(new Set());
  /** Which category to show in the single roster overview chart */
  const [chartCategory, setChartCategory] = useState<"site" | "workStatus" | "status" | "type">("site");

  const allRows = useMemo(() => getRosterRows(), []);
  const results = useMemo(
    () =>
      filterRosterRows(allRows, {
        query: query || undefined,
        site: siteFilter || undefined,
        workStatus: workStatusFilter,
        status: statusFilter,
      }),
    [allRows, query, siteFilter, workStatusFilter, statusFilter],
  );

  const handleRowClick = (row: RosterRow) => {
    setDrillInRow(row);
    setSheetOpen(true);
  };

  /** Group filtered results by provider (for expandable view) */
  const groupedByProvider = useMemo(() => {
    const map = new Map<string, RosterRow[]>();
    results.forEach((row) => {
      const list = map.get(row.provider.id) ?? [];
      list.push(row);
      map.set(row.provider.id, list);
    });
    return Array.from(map.entries()).map(([, rows]) => ({
      provider: rows[0].provider,
      rows,
    }));
  }, [results]);

  const toggleExpanded = (providerId: string) => {
    setExpandedProviderIds((prev) => {
      const next = new Set(prev);
      if (next.has(providerId)) next.delete(providerId);
      else next.add(providerId);
      return next;
    });
  };

  const handleFilterBySite = (e: React.MouseEvent, site: string) => {
    e.stopPropagation();
    setSiteFilter(site);
  };
  const handleFilterByWorkStatus = (e: React.MouseEvent, workStatus: WorkStatus) => {
    e.stopPropagation();
    setWorkStatusFilter(workStatus);
  };
  const handleFilterByStatus = (e: React.MouseEvent, status: RelationshipStatus) => {
    e.stopPropagation();
    setStatusFilter(status);
  };

  const filterableCellClass = "cursor-pointer hover:underline hover:text-primary select-none";
  const filterableTitle = "Click to filter by this value";

  // Chart data from current filtered results (provider–site relationship counts)
  const chartDataBySite = useMemo(() => {
    return ROSTER_SITES.map((site) => ({
      name: site,
      count: results.filter((r) => r.relationship.site === site).length,
    }));
  }, [results]);
  const chartDataByWorkStatus = useMemo(() => {
    return WORK_STATUSES.map((ws) => ({
      name: ws,
      count: results.filter((r) => r.relationship.workStatus === ws).length,
    }));
  }, [results]);
  const chartDataByStatus = useMemo(() => {
    return RELATIONSHIP_STATUSES.map((s) => ({
      name: s,
      count: results.filter((r) => r.relationship.status === s).length,
    }));
  }, [results]);
  const chartDataByType = useMemo(() => {
    return [
      { name: "Physician", count: results.filter((r) => r.provider.type === "Physician").length },
      { name: "APC", count: results.filter((r) => r.provider.type === "APC").length },
    ];
  }, [results]);

  const barChartConfig = { count: { label: "Providers", color: "hsl(var(--primary))" } };
  const pieChartConfig = { count: { label: "Providers", color: "hsl(var(--primary))" } };
  const PIE_COLORS = ["hsl(var(--primary))", "hsl(215 20% 55%)", "hsl(262 83% 58%)", "hsl(189 94% 43%)", "hsl(38 92% 50%)"];

  const chartData = useMemo(() => {
    switch (chartCategory) {
      case "site": return chartDataBySite;
      case "workStatus": return chartDataByWorkStatus;
      case "status": return chartDataByStatus;
      case "type": return chartDataByType;
      default: return chartDataBySite;
    }
  }, [chartCategory, chartDataBySite, chartDataByWorkStatus, chartDataByStatus, chartDataByType]);

  const chartDataForPie = useMemo(() => chartData.filter((d) => d.count > 0), [chartData]);

  const chartCategoryLabels: Record<typeof chartCategory, string> = {
    site: "By site",
    workStatus: "By work status",
    status: "By status",
    type: "By type",
  };

  const TABLE_COLUMNS = [
    { id: "providerName", label: "Provider Name" },
    { id: "preferredName", label: "Preferred Name" },
    { id: "type", label: "Type" },
    { id: "serviceLines", label: "Service Lines" },
    { id: "site", label: "Site" },
    { id: "workStatus", label: "Work Status" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "status", label: "Status" },
  ] as const;

  const defaultReportBuilderValue: ReportBuilderValue = {
    title: "Roster Report",
    subtitle: "",
    blocks: [
      { id: "chart-0", type: "chart", x: 20, y: 20, width: 360, height: 80 },
      { id: "table-0", type: "table", x: 20, y: 110, width: 360, height: 80 },
      { id: "summary-0", type: "summary", x: 20, y: 200, width: 360, height: 80 },
    ],
  };

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportStep, setExportStep] = useState<1 | 2>(1);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [pdfOrientation, setPdfOrientation] = useState<"portrait" | "landscape">("portrait");
  const [pdfTablePosition, setPdfTablePosition] = useState<"top" | "center" | "bottom">("top");
  const [exportAction, setExportAction] = useState<"download" | "email">("download");
  const [exportEmailTo, setExportEmailTo] = useState("");
  const [reportBuilderValue, setReportBuilderValue] = useState<ReportBuilderValue>(defaultReportBuilderValue);
  const [reportSelectedColumns, setReportSelectedColumns] = useState<string[]>(TABLE_COLUMNS.map((c) => c.id));

  const toggleColumn = (id: string) => {
    setReportSelectedColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const getRowCell = (r: RosterRow, colId: string): string => {
    switch (colId) {
      case "providerName": return r.provider.name;
      case "preferredName": return r.provider.preferredName ?? "";
      case "type": return r.provider.type;
      case "serviceLines": return r.provider.serviceLines.join("; ");
      case "site": return r.relationship.site;
      case "workStatus": return r.relationship.workStatus;
      case "email": return r.provider.email;
      case "phone": return r.provider.phone;
      case "status": return r.relationship.status;
      default: return "";
    }
  };

  const tableRowsForPreview = useMemo(() => {
    return results.slice(0, 50).map((r) => {
      const row: Record<string, string> = {};
      TABLE_COLUMNS.forEach((c) => { row[c.id] = getRowCell(r, c.id); });
      return row;
    });
  }, [results]);

  const handleDownloadCSV = (rows: RosterRow[], columns: string[]) => {
    const orderedCols = TABLE_COLUMNS.filter((c) => columns.includes(c.id));
    const headers = orderedCols.map((c) => c.label);
    const escape = (v: string) => (v.includes(",") || v.includes('"') ? `"${String(v).replace(/"/g, '""')}"` : v);
    const rowToCsv = (r: RosterRow) => orderedCols.map((c) => escape(getRowCell(r, c.id))).join(",");
    const csv = [headers.join(","), ...rows.map(rowToCsv)].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roster-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = (
    rows: RosterRow[],
    orientation: "portrait" | "landscape",
    builderValue: ReportBuilderValue,
    columns: string[],
    chartCat: "site" | "workStatus" | "status" | "type",
    chartDataForPdf: { name: string; count: number }[],
    chartDataBar: { name: string; count: number }[],
  ) => {
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF({ orientation });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const canvasSize = getCanvasSize(orientation);
      const scaleX = pageW / canvasSize.width;
      const scaleY = pageH / canvasSize.height;

      const toPdf = (x: number, y: number) => ({ x: x * scaleX, y: y * scaleY });

      const orderedCols = TABLE_COLUMNS.filter((c) => columns.includes(c.id));
      const tableRowsForPdf = rows.slice(0, 40).map((r) => {
        const row: Record<string, string> = {};
        TABLE_COLUMNS.forEach((c) => { row[c.id] = getRowCell(r, c.id); });
        return row;
      });

      if (builderValue.title) {
        doc.setFontSize(14);
        const t = toPdf(8, 8);
        doc.text(builderValue.title, t.x, t.y);
      }
      if (builderValue.subtitle) {
        doc.setFontSize(9);
        const t = toPdf(8, 24);
        doc.text(builderValue.subtitle, t.x, t.y);
      }

      builderValue.blocks.forEach((block: ReportBlock, index: number) => {
        const layout = getBlockLayout(block, index, builderValue.blocks, canvasSize.width, canvasSize.height);
        const x0 = layout.x * scaleX;
        const y0 = layout.y * scaleY;
        const w = layout.width * scaleX;
        const h = layout.height * scaleY;

        if (block.type === "chart") {
          const data = chartCat === "status" || chartCat === "type" ? chartDataForPdf : chartDataBar;
          if (data.length === 0) return;
          const pad = 4 * scaleX;
          const chartW = w - pad * 2;
          const chartH = h - pad * 2 - 6 * scaleY;
          const maxCount = Math.max(...data.map((d) => d.count), 1);
          const barW = chartW / data.length - 2;
          const barBaseY = y0 + h - pad - 2 * scaleY;
          doc.setFontSize(6);
          data.forEach((d, i) => {
            const barH = (d.count / maxCount) * chartH;
            const bx = x0 + pad + i * (chartW / data.length);
            doc.setFillColor(66, 133, 244);
            doc.rect(bx, barBaseY - barH, Math.max(barW, 1), barH, "F");
            doc.text(String(d.count), bx + barW / 2 - 1, barBaseY - barH - 1);
            const label = String(d.name).slice(0, 6);
            doc.text(label, bx, barBaseY + 4);
          });
        }
        if (block.type === "table" && orderedCols.length > 0) {
          const cellW = w / orderedCols.length;
          const rowH = Math.min(5, (h - 4) / Math.max(1, Math.floor((h - 4) / 5)));
          const maxRows = Math.floor((h - 4 - rowH) / rowH);
          doc.setFontSize(7);
          orderedCols.forEach((col, i) => {
            doc.text(col.label.slice(0, 10), x0 + 2 + i * cellW, y0 + rowH - 1);
          });
          doc.setDrawColor(200, 200, 200);
          doc.line(x0, y0 + rowH, x0 + w, y0 + rowH);
          tableRowsForPdf.slice(0, maxRows).forEach((row, ri) => {
            const ry = y0 + rowH + (ri + 1) * rowH - 1;
            orderedCols.forEach((col, ci) => {
              doc.text(String(row[col.id] ?? "").slice(0, 12), x0 + 2 + ci * cellW, ry);
            });
          });
        }
        if (block.type === "summary") {
          doc.setFontSize(9);
          doc.text(`Generated: ${new Date().toLocaleDateString()}`, x0 + 2, y0 + 5);
          doc.text(`Total rows: ${rows.length}`, x0 + 2, y0 + 10);
        }
        if (block.type === "text" && block.text?.trim()) {
          doc.setFontSize(8);
          const lines = doc.splitTextToSize(block.text.trim(), w - 4);
          lines.slice(0, Math.floor((h - 4) / 4)).forEach((line: string, i: number) => {
            doc.text(line, x0 + 2, y0 + 4 + (i + 1) * 4);
          });
        }
      });

      doc.save(`roster-export-${new Date().toISOString().slice(0, 10)}.pdf`);
    });
  };

  const handleExportSubmit = () => {
    if (exportAction === "email" && !exportEmailTo.trim()) return;
    const cols = reportSelectedColumns.length > 0 ? reportSelectedColumns : TABLE_COLUMNS.map((c) => c.id);
    if (exportFormat === "csv") {
      handleDownloadCSV(results, cols);
      if (exportAction === "email") alert(`Report would be sent to ${exportEmailTo.trim()}. (Demo: CSV downloaded.)`);
    } else {
      handleDownloadPDF(results, pdfOrientation, reportBuilderValue, cols, chartCategory, chartDataForPie, chartData);
      if (exportAction === "email") alert(`Report would be sent to ${exportEmailTo.trim()}. (Demo: PDF downloaded.)`);
    }
    setExportDialogOpen(false);
    setExportStep(1);
  };

  const openExportDialog = () => {
    setExportStep(1);
    setExportDialogOpen(true);
  };
  const onExportDialogOpenChange = (open: boolean) => {
    setExportDialogOpen(open);
    if (!open) setExportStep(1);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Roster</h1>
          <p className="text-muted-foreground mt-1">
            Portal, education, and benefits for providers and site coordinators.
          </p>
        </div>

        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-11">
            <TabsTrigger value="portal" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Portal
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="benefits" className="gap-2">
              <Heart className="h-4 w-4" />
              Benefits
            </TabsTrigger>
          </TabsList>

          {/* ——— Portal ——— */}
          <TabsContent value="portal" className="mt-6 space-y-6">
            {/* Roster overview — single chart with category buttons */}
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="text-lg">Roster overview</CardTitle>
                    <CardDescription>
                      Choose a category to see provider counts (from current filters).
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(["site", "workStatus", "status", "type"] as const).map((cat) => (
                        <Button
                          key={cat}
                          variant={chartCategory === cat ? "default" : "outline"}
                          size="sm"
                          onClick={() => setChartCategory(cat)}
                        >
                          {chartCategoryLabels[cat]}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              {/* Sticky Export button — fixed to viewport so always visible when scrolling */}
              <div className="fixed bottom-6 right-6 z-50">
                <Button variant="default" size="sm" className="gap-2 shadow-lg" onClick={openExportDialog}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              <CardContent>
                <ChartContainer config={chartCategory === "status" || chartCategory === "type" ? pieChartConfig : barChartConfig} className="h-[280px] w-full">
                  {chartCategory === "status" || chartCategory === "type" ? (
                    <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                      <ChartTooltip content={<ChartTooltipContent formatter={(value) => [value, "Providers"]} />} />
                      <Pie data={chartDataForPie} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {chartDataForPie.map((_, index) => (
                          <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  ) : (
                    <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} width={28} />
                      <ChartTooltip content={<ChartTooltipContent formatter={(value) => [value, "Providers"]} />} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="var(--color-count)" />
                    </BarChart>
                  )}
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Export dialog — step 1: format/options, step 2: CMS report builder */}
            <Dialog open={exportDialogOpen} onOpenChange={onExportDialogOpenChange}>
              <DialogContent className={exportStep === 2 ? "sm:max-w-4xl max-h-[90vh] overflow-y-auto" : "sm:max-w-lg"}>
                <DialogHeader>
                  <DialogTitle>{exportStep === 1 ? "Export roster" : "Build your report"}</DialogTitle>
                  <DialogDescription>
                    {exportStep === 1
                      ? "Choose format and options, then build the report layout."
                      : "Set the title and subtitle, then add and arrange assets on the report. Drag to reorder."}
                  </DialogDescription>
                </DialogHeader>

                {exportStep === 1 ? (
                  <>
                    <div className="grid gap-4 py-2">
                      <div className="space-y-2">
                        <Label>Format</Label>
                        <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as "csv" | "pdf")} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="csv" id="fmt-csv" />
                            <Label htmlFor="fmt-csv" className="font-normal">CSV</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pdf" id="fmt-pdf" />
                            <Label htmlFor="fmt-pdf" className="font-normal">PDF</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {exportFormat === "pdf" && (
                        <div className="space-y-2">
                          <Label>Orientation</Label>
                          <Select value={pdfOrientation} onValueChange={(v) => setPdfOrientation(v as "portrait" | "landscape")}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="portrait">Portrait</SelectItem>
                              <SelectItem value="landscape">Landscape</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label>Action</Label>
                        <RadioGroup value={exportAction} onValueChange={(v) => setExportAction(v as "download" | "email")} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="download" id="act-download" />
                            <Label htmlFor="act-download" className="font-normal">Download</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="act-email" />
                            <Label htmlFor="act-email" className="font-normal">Send by email</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {exportAction === "email" && (
                        <div className="space-y-2">
                          <Label htmlFor="export-email">Email to</Label>
                          <Input id="export-email" type="email" placeholder="email@example.com" value={exportEmailTo} onChange={(e) => setExportEmailTo(e.target.value)} />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => setExportStep(2)}>Next: Build report</Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <div className="py-2">
                      <ReportBuilder
                        value={reportBuilderValue}
                        onChange={setReportBuilderValue}
                        orientation={pdfOrientation}
                        tableColumns={TABLE_COLUMNS}
                        selectedColumns={reportSelectedColumns}
                        onToggleColumn={toggleColumn}
                        chartCategory={chartCategory}
                        chartCategoryLabel={chartCategoryLabels[chartCategory]}
                        chartData={chartData}
                        chartDataForPie={chartDataForPie}
                        tableRowCount={results.length}
                        tableRows={tableRowsForPreview}
                        exportFormat={exportFormat}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setExportStep(1)}>Back</Button>
                      <Button onClick={handleExportSubmit} disabled={exportAction === "email" && !exportEmailTo.trim()}>
                        {exportAction === "download" ? "Generate & Download" : "Generate & Send"}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* Search (current provider search) */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search
                </CardTitle>
                <CardDescription>
                  One row per provider–site relationship. Status and Work Status apply to the relationship. Filter by Site, Work Status, and Status (Active/Benched/Pending).
                </CardDescription>
                <div className="relative mt-4 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, preferred name, email, site..."
                    className="pl-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <div className="min-w-[140px]">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Sites</p>
                    <Select value={siteFilter || "all"} onValueChange={(v) => setSiteFilter(v === "all" ? "" : v)}>
                      <SelectTrigger><SelectValue placeholder="All sites" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All sites</SelectItem>
                        {ROSTER_SITES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="min-w-[140px]">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Status</p>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as RelationshipStatus | "All")}>
                      <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {RELATIONSHIP_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Work Status</p>
                    <Tabs value={workStatusFilter} onValueChange={(v) => setWorkStatusFilter(v as WorkStatus | "All")} className="w-full">
                      <TabsList className="flex flex-wrap h-auto gap-1 p-1">
                        <TabsTrigger value="All" className="min-w-[2.5rem]">All</TabsTrigger>
                        {WORK_STATUSES.map((s) => (
                          <TabsTrigger key={s} value={s} className="min-w-[2.5rem]">{s}</TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">View:</span>
                    <Button
                      variant={viewMode === "flat" ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setViewMode("flat")}
                    >
                      <ListTree className="h-4 w-4" />
                      One row per relationship
                    </Button>
                    <Button
                      variant={viewMode === "grouped" ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setViewMode("grouped")}
                    >
                      <Rows3 className="h-4 w-4" />
                      Group by provider (expand)
                    </Button>
                  </div>
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add to Roster
                  </Button>
                </div>
                {results.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-12 text-center">No relationships match the current filters.</p>
                ) : viewMode === "grouped" ? (
                  <>
                    <p className="text-xs text-muted-foreground mb-3">
                      One row per provider. Expand to see site relationships; <strong className="text-foreground">Status</strong> and <strong className="text-foreground">Work Status</strong> are per relationship.
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10" />
                          <TableHead>Provider Name</TableHead>
                          <TableHead>Preferred Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Service Lines</TableHead>
                          <TableHead>Site</TableHead>
                          <TableHead>Work Status</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-16 text-right">Edit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupedByProvider.map(({ provider, rows }) => {
                          const isExpanded = expandedProviderIds.has(provider.id);
                          const firstRow = rows[0];
                          return (
                            <Fragment key={provider.id}>
                              <TableRow
                                key={provider.id}
                                className="cursor-pointer hover:bg-muted/50"
                              >
                                <TableCell className="w-10 p-1" onClick={(e) => { e.stopPropagation(); toggleExpanded(provider.id); }}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  </Button>
                                </TableCell>
                                <TableCell className="font-medium" onClick={() => handleRowClick(firstRow)}>{provider.name}</TableCell>
                                <TableCell className="text-muted-foreground" onClick={() => handleRowClick(firstRow)}>{provider.preferredName ?? "—"}</TableCell>
                                <TableCell onClick={() => handleRowClick(firstRow)}>{provider.type}</TableCell>
                                <TableCell onClick={() => handleRowClick(firstRow)}>{provider.serviceLines.join(", ")}</TableCell>
                                <TableCell className="text-muted-foreground" onClick={() => handleRowClick(firstRow)}>
                                  {rows.length} site{rows.length !== 1 ? "s" : ""}
                                </TableCell>
                                <TableCell onClick={() => handleRowClick(firstRow)}>—</TableCell>
                                <TableCell className="text-muted-foreground text-sm" onClick={() => handleRowClick(firstRow)}>{provider.email}</TableCell>
                                <TableCell className="text-muted-foreground text-sm" onClick={() => handleRowClick(firstRow)}>{provider.phone}</TableCell>
                                <TableCell onClick={() => handleRowClick(firstRow)}>—</TableCell>
                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit provider">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              {isExpanded && rows.map((row) => (
                                <TableRow
                                  key={`${row.provider.id}-${row.relationship.site}`}
                                  className="bg-muted/30 hover:bg-muted/50 cursor-pointer"
                                  onClick={() => handleRowClick(row)}
                                >
                                  <TableCell className="w-10 p-1" />
                                  <TableCell className="pl-6 text-muted-foreground font-normal text-sm">—</TableCell>
                                  <TableCell />
                                  <TableCell />
                                  <TableCell />
                                  <TableCell className="font-medium">
                                    <span role="button" tabIndex={0} title={filterableTitle} onClick={(e) => handleFilterBySite(e, row.relationship.site)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); setSiteFilter(row.relationship.site); } }} className={filterableCellClass}>
                                      {row.relationship.site}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="secondary" role="button" tabIndex={0} title={filterableTitle} className={filterableCellClass} onClick={(e) => handleFilterByWorkStatus(e, row.relationship.workStatus)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); setWorkStatusFilter(row.relationship.workStatus); } }}>
                                      {row.relationship.workStatus}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground text-sm">{provider.email}</TableCell>
                                  <TableCell className="text-muted-foreground text-sm">{provider.phone}</TableCell>
                                  <TableCell>
                                    <Badge variant={row.relationship.status === "Active" ? "default" : row.relationship.status === "Pending" ? "secondary" : "outline"} role="button" tabIndex={0} title={filterableTitle} className={filterableCellClass} onClick={(e) => handleFilterByStatus(e, row.relationship.status)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); setStatusFilter(row.relationship.status); } }}>
                                      {row.relationship.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit relationship">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground mb-3">
                      Each row is one provider–hospital relationship. <strong className="text-foreground">Status</strong> and <strong className="text-foreground">Work Status</strong> apply to that relationship (e.g. Active at one site, Pending at another).
                    </p>
                    <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider Name</TableHead>
                        <TableHead>Preferred Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Service Lines</TableHead>
                        <TableHead>Site</TableHead>
                        <TableHead title="Per provider–hospital relationship">Work Status</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead title="Per provider–hospital relationship">Status</TableHead>
                        <TableHead className="w-16 text-right">Edit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((row) => (
                        <TableRow
                          key={`${row.provider.id}-${row.relationship.site}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleRowClick(row)}
                          onKeyDown={(e) => e.key === "Enter" && handleRowClick(row)}
                          className="cursor-pointer"
                        >
                          <TableCell className="font-medium">{row.provider.name}</TableCell>
                          <TableCell className="text-muted-foreground">{row.provider.preferredName ?? "—"}</TableCell>
                          <TableCell>{row.provider.type}</TableCell>
                          <TableCell>{row.provider.serviceLines.join(", ")}</TableCell>
                          <TableCell>
                            <span role="button" tabIndex={0} title={filterableTitle} onClick={(e) => handleFilterBySite(e, row.relationship.site)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); setSiteFilter(row.relationship.site); } }} className={filterableCellClass}>
                              {row.relationship.site}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" role="button" tabIndex={0} title={filterableTitle} className={filterableCellClass} onClick={(e) => handleFilterByWorkStatus(e, row.relationship.workStatus)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); setWorkStatusFilter(row.relationship.workStatus); } }}>
                              {row.relationship.workStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{row.provider.email}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{row.provider.phone}</TableCell>
                          <TableCell>
                            <Badge variant={row.relationship.status === "Active" ? "default" : row.relationship.status === "Pending" ? "secondary" : "outline"} role="button" tabIndex={0} title={filterableTitle} className={filterableCellClass} onClick={(e) => handleFilterByStatus(e, row.relationship.status)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); setStatusFilter(row.relationship.status); } }}>
                              {row.relationship.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit relationship">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Welcome */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welcome</CardTitle>
                <CardDescription>Your hub for facility updates and quick access.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use Search above to find providers credentialed at your site. Check Announcements and Priority Items for action items and deadlines.
                </p>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Announcements
                </CardTitle>
                <CardDescription>Latest facility and organization updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_ANNOUNCEMENTS.map((a) => (
                    <li key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">{a.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{a.type}</Badge>
                        <span className="text-xs text-muted-foreground">{a.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Posts
                </CardTitle>
                <CardDescription>Recent posts from your facility and teams.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_POSTS.map((p) => (
                    <li key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">{p.title}</span>
                      <span className="text-xs text-muted-foreground">{p.author} · {p.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Priority Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Priority Items
                </CardTitle>
                <CardDescription>Action items and upcoming deadlines.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_PRIORITY_ITEMS.map((item) => (
                    <li key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm">{item.label}</span>
                      <Badge variant="outline" className="text-xs">Due {item.due}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Meetings and events at your facility.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_EVENTS.map((e) => (
                    <li key={e.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">{e.title}</span>
                      <span className="text-sm text-muted-foreground">{e.date} · {e.time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contacts
                </CardTitle>
                <CardDescription>Key contacts for credentialing, scheduling, and support.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_CONTACTS.map((c, i) => (
                    <li key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.role} · {c.email}</p>
                      </div>
                      <Button variant="ghost" size="sm">Contact</Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ——— Education ——— */}
          <TabsContent value="education" className="mt-6 space-y-6">
            {/* Banner */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <GraduationCap className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Education &amp; NMHS</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Onboarding, course catalog, and teaching resources for providers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Onboarding */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Provider Onboarding
                </CardTitle>
                <CardDescription>New provider onboarding checklist and resources.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete required steps for credentialing and facility access. Track progress in your onboarding dashboard.
                </p>
                <Button variant="outline" asChild>
                  <a href="/onboarding">Go to Onboarding</a>
                </Button>
              </CardContent>
            </Card>

            {/* Education and NMHS Course Catalog */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookMarked className="h-5 w-5" />
                  Education and NMHS Course Catalog
                </CardTitle>
                <CardDescription>Browse required and optional courses.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  HIPAA, safety, and clinical courses. Filter by department and requirement status.
                </p>
                <Button variant="outline">View course catalog</Button>
              </CardContent>
            </Card>

            {/* Action Center */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Action Center
                </CardTitle>
                <CardDescription>Pending training and compliance actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Courses due, attestations, and renewals. Complete items to stay in compliance.
                </p>
                <Button variant="outline">Open Action Center</Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Quick Links
                </CardTitle>
                <CardDescription>Shortcuts to learning and policy resources.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {MOCK_QUICK_LINKS.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="text-sm text-primary hover:underline flex items-center gap-2">
                        <Link2 className="h-3.5 w-3.5" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Teaching our Teachers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Teaching our Teachers
                </CardTitle>
                <CardDescription>Program for educator development and train-the-trainer.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Resources and cohorts for providers who teach or precept. Sign up for the next session.
                </p>
                <Button variant="outline">Learn more</Button>
              </CardContent>
            </Card>

            {/* Education Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Education Posts
                </CardTitle>
                <CardDescription>Updates from the education team.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_EDUCATION_POSTS.map((p) => (
                    <li key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">{p.title}</span>
                      <span className="text-xs text-muted-foreground">{p.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ——— Benefits ——— */}
          <TabsContent value="benefits" className="mt-6 space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Heart className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Benefits</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Your health, dental, vision, and other benefits as a rostered provider.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  My benefits summary
                </CardTitle>
                <CardDescription>Current coverage and plan details.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_BENEFITS_PLANS.map((plan, i) => (
                    <li key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-sm">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">{plan.plan}</p>
                      </div>
                      <Badge variant="secondary">{plan.status}</Badge>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-4">View full benefits</Button>
              </CardContent>
            </Card>

            {/* Open enrollment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Open enrollment
                </CardTitle>
                <CardDescription>Enroll or make changes during open enrollment.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Next open enrollment: March 1–15, 2025. Update dependents, add optional coverage, or switch plans.
                </p>
                <Button variant="outline">Enrollment guide</Button>
              </CardContent>
            </Card>

            {/* Dependents & contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Dependents &amp; life events
                </CardTitle>
                <CardDescription>Manage dependents and report qualifying life events.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add or remove dependents, update contact info, and submit life event changes (marriage, birth, etc.) for benefits.
                </p>
                <Button variant="outline">Manage dependents</Button>
              </CardContent>
            </Card>

            {/* Benefits contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Benefits support
                </CardTitle>
                <CardDescription>HR and benefits contacts for rostered providers.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about eligibility, claims, or plan options? Contact HR Benefits or your facility coordinator.
                </p>
                <Button variant="outline">Contact benefits</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <RosterSearchDrillInSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        row={drillInRow}
      />
    </AppLayout>
  );
}
