import { useState, useRef, useCallback } from "react";
import {
  BarChart3,
  Table2,
  FileText,
  Type,
  GripVertical,
  Trash2,
  Plus,
  Move,
  Maximize2,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const CANVAS_PORTRAIT_WIDTH = 400;
export const CANVAS_PORTRAIT_HEIGHT = 560;
export const CANVAS_WIDTH = CANVAS_PORTRAIT_WIDTH;
export const CANVAS_HEIGHT = CANVAS_PORTRAIT_HEIGHT;

export type PageOrientation = "portrait" | "landscape";

export function getCanvasSize(orientation: PageOrientation): { width: number; height: number } {
  return orientation === "landscape"
    ? { width: CANVAS_PORTRAIT_HEIGHT, height: CANVAS_PORTRAIT_WIDTH }
    : { width: CANVAS_PORTRAIT_WIDTH, height: CANVAS_PORTRAIT_HEIGHT };
}

export type ReportBlockType = "chart" | "table" | "summary" | "text";

export interface ReportBlock {
  id: string;
  type: ReportBlockType;
  text?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface ReportBuilderValue {
  title: string;
  subtitle: string;
  blocks: ReportBlock[];
}

const ASSET_PALETTE: { type: ReportBlockType; label: string; icon: typeof BarChart3 }[] = [
  { type: "chart", label: "Chart summary", icon: BarChart3 },
  { type: "table", label: "Table", icon: Table2 },
  { type: "summary", label: "Report info", icon: FileText },
  { type: "text", label: "Text block", icon: Type },
];

const MIN_BLOCK_WIDTH = 80;
const MIN_BLOCK_HEIGHT = 40;
const DEFAULT_BLOCK_WIDTH = 360;
const DEFAULT_BLOCK_HEIGHT = 80;
const MARGIN = 20;
const GAP = 10;

export type ChartCategoryKey = "site" | "workStatus" | "status" | "type";

interface ReportBuilderProps {
  value: ReportBuilderValue;
  onChange: (value: ReportBuilderValue) => void;
  orientation: PageOrientation;
  tableColumns: readonly { id: string; label: string }[];
  selectedColumns: string[];
  onToggleColumn: (id: string) => void;
  chartCategory: ChartCategoryKey;
  chartCategoryLabel: string;
  chartData: { name: string; count: number }[];
  chartDataForPie: { name: string; count: number }[];
  tableRowCount: number;
  tableRows: Record<string, string>[];
  exportFormat: "csv" | "pdf";
}

function createBlock(
  type: ReportBlockType,
  existingBlocks: ReportBlock[],
  atCursor: { x: number; y: number } | undefined,
  canvasWidth: number,
  canvasHeight: number,
): ReportBlock {
  const width = DEFAULT_BLOCK_WIDTH;
  const height = DEFAULT_BLOCK_HEIGHT;
  if (atCursor) {
    const x = Math.max(0, Math.min(canvasWidth - width, atCursor.x));
    const y = Math.max(0, Math.min(canvasHeight - height, atCursor.y));
    return {
      id: `block-${type}-${Date.now()}`,
      type,
      text: type === "text" ? "" : undefined,
      x,
      y,
      width,
      height,
    };
  }
  const y =
    existingBlocks.length === 0
      ? MARGIN
      : Math.max(
          ...existingBlocks.map((b) => (b.y ?? MARGIN) + (b.height ?? DEFAULT_BLOCK_HEIGHT)),
          0,
        ) + GAP;
  return {
    id: `block-${type}-${Date.now()}`,
    type,
    text: type === "text" ? "" : undefined,
    x: MARGIN,
    y,
    width,
    height,
  };
}

export function getBlockLayout(
  block: ReportBlock,
  index: number,
  all: ReportBlock[],
  canvasWidth: number = CANVAS_WIDTH,
  canvasHeight: number = CANVAS_HEIGHT,
): { x: number; y: number; width: number; height: number } {
  const width = block.width ?? DEFAULT_BLOCK_WIDTH;
  const height = block.height ?? DEFAULT_BLOCK_HEIGHT;
  if (block.x != null && block.y != null) {
    return { x: block.x, y: block.y, width, height };
  }
  const y =
    index === 0
      ? MARGIN
      : (() => {
          const prev = all[index - 1];
          const py = prev.y ?? MARGIN;
          const ph = prev.height ?? DEFAULT_BLOCK_HEIGHT;
          return py + ph + GAP;
        })();
  return { x: MARGIN, y, width, height };
}

function getCanvasCoords(canvasEl: HTMLDivElement | null, clientX: number, clientY: number): { x: number; y: number } {
  if (!canvasEl) return { x: 0, y: 0 };
  const rect = canvasEl.getBoundingClientRect();
  const borderLeft = canvasEl.clientLeft || 0;
  const borderTop = canvasEl.clientTop || 0;
  return {
    x: clientX - rect.left - borderLeft,
    y: clientY - rect.top - borderTop,
  };
}

function isPointInCanvas(canvasEl: HTMLDivElement | null, clientX: number, clientY: number): boolean {
  if (!canvasEl) return false;
  const rect = canvasEl.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}

function PaletteItem({
  type,
  label,
  icon: Icon,
  onAdd,
  onDragStart,
}: {
  type: ReportBlockType;
  label: string;
  icon: typeof BarChart3;
  onAdd: () => void;
  onDragStart: (e: React.PointerEvent, assetType: ReportBlockType) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
      <div
        className="flex items-center gap-2 flex-1 min-w-0 cursor-grab active:cursor-grabbing select-none"
        onPointerDown={(e) => {
          if (e.button === 0) onDragStart(e, type);
        }}
      >
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{label}</span>
      </div>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onAdd} aria-label={`Add ${label}`}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

function BlockContent({
  block,
  layout,
  chartCategoryLabel,
  chartData,
  tableRowCount,
  selectedColumnsCount,
  onTextChange,
  compact,
}: {
  block: ReportBlock;
  layout?: { width: number; height: number };
  chartCategoryLabel: string;
  chartData: { name: string; count: number }[];
  tableRowCount: number;
  selectedColumnsCount: number;
  onTextChange?: (text: string) => void;
  compact?: boolean;
}) {
  const h = layout?.height ?? (block.height ?? 80);
  switch (block.type) {
    case "chart":
      return (
        <div className="rounded border bg-muted/30 p-2 text-sm h-full overflow-hidden flex flex-col">
          <p className="font-medium text-muted-foreground text-xs shrink-0">Chart summary</p>
          <p className="text-xs text-muted-foreground truncate flex-1">{chartCategoryLabel}: {chartData.map((d) => `${d.name} (${d.count})`).join(", ")}</p>
        </div>
      );
    case "table":
      return (
        <div className="rounded border bg-muted/30 p-2 text-sm h-full overflow-hidden flex flex-col">
          <p className="font-medium text-muted-foreground text-xs shrink-0">Table</p>
          <p className="text-xs text-muted-foreground truncate flex-1">{selectedColumnsCount} cols · {tableRowCount} rows</p>
        </div>
      );
    case "summary":
      return (
        <div className="rounded border bg-muted/30 p-2 text-sm h-full overflow-hidden flex flex-col">
          <p className="font-medium text-muted-foreground text-xs shrink-0">Report info</p>
          <p className="text-xs text-muted-foreground truncate flex-1">Generated date, total rows</p>
        </div>
      );
    case "text":
      return (
        <div className="rounded border bg-muted/30 p-1.5 h-full overflow-hidden flex flex-col">
          <Textarea
            placeholder="Enter your text..."
            value={block.text ?? ""}
            onChange={(e) => onTextChange?.(e.target.value)}
            className={cn("text-sm resize-none border-0 bg-transparent focus-visible:ring-0 flex-1 min-h-0", compact && "min-h-[60px]")}
            style={{ minHeight: Math.max(h - 24, 36) }}
          />
        </div>
      );
    default:
      return null;
  }
}

function CanvasBlock({
  block,
  layout,
  canvasWidth,
  canvasHeight,
  isSelected,
  isDragging,
  onSelect,
  onDragHandlePointerDown,
  chartCategoryLabel,
  chartData,
  tableRowCount,
  selectedColumnsCount,
  onRemove,
  onTextChange,
  onUpdate,
  onResizeStart,
}: {
  block: ReportBlock;
  layout: { x: number; y: number; width: number; height: number };
  canvasWidth: number;
  canvasHeight: number;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onDragHandlePointerDown: (e: React.PointerEvent) => void;
  chartCategoryLabel: string;
  chartData: { name: string; count: number }[];
  tableRowCount: number;
  selectedColumnsCount: number;
  onRemove: () => void;
  onTextChange?: (text: string) => void;
  onUpdate: (upd: Partial<ReportBlock>) => void;
  onResizeStart: (e: React.PointerEvent, block: ReportBlock) => void;
}) {
  const clamp = useCallback(
    (upd: Partial<ReportBlock>) => {
      const x = upd.x ?? layout.x;
      const y = upd.y ?? layout.y;
      const width = upd.width ?? layout.width;
      const height = upd.height ?? layout.height;
      onUpdate({
        x: Math.max(0, Math.min(canvasWidth - width, x)),
        y: Math.max(0, Math.min(canvasHeight - height, y)),
        width: Math.max(MIN_BLOCK_WIDTH, Math.min(canvasWidth - x, width)),
        height: Math.max(MIN_BLOCK_HEIGHT, Math.min(canvasHeight - y, height)),
      });
    },
    [layout, onUpdate, canvasWidth, canvasHeight],
  );

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      style={{
        position: "absolute",
        left: layout.x,
        top: layout.y,
        width: layout.width,
        height: layout.height,
      }}
      className={cn(
        "rounded-lg border-2 bg-background overflow-hidden flex flex-col group",
        isSelected ? "border-primary ring-2 ring-primary/20 z-10" : "border-border hover:border-muted-foreground/50",
        isDragging && "shadow-xl z-20 opacity-95",
      )}
    >
      <div
        className="flex items-center justify-between gap-1 px-1.5 py-0.5 border-b bg-muted/30 shrink-0 cursor-grab active:cursor-grabbing select-none touch-none"
        onPointerDown={(e) => {
          e.stopPropagation();
          if (e.button === 0) onDragHandlePointerDown(e);
        }}
      >
        <Move className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground truncate flex-1">Drag to move</span>
        <Popover>
          <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0" aria-label="Position & size">
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-3">
              <p className="text-sm font-medium">Position & size</p>
                <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">X</Label>
                  <Input type="number" min={0} max={canvasWidth - MIN_BLOCK_WIDTH} value={Math.round(layout.x)} onChange={(e) => clamp({ x: e.target.value === "" ? 0 : Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Y</Label>
                  <Input type="number" min={0} max={canvasHeight - MIN_BLOCK_HEIGHT} value={Math.round(layout.y)} onChange={(e) => clamp({ y: e.target.value === "" ? 0 : Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">W</Label>
                  <Input type="number" min={MIN_BLOCK_WIDTH} max={canvasWidth} value={Math.round(layout.width)} onChange={(e) => clamp({ width: e.target.value === "" ? MIN_BLOCK_WIDTH : Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">H</Label>
                  <Input type="number" min={MIN_BLOCK_HEIGHT} max={canvasHeight} value={Math.round(layout.height)} onChange={(e) => clamp({ height: e.target.value === "" ? MIN_BLOCK_HEIGHT : Number(e.target.value) })} />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); onRemove(); }} aria-label="Remove block">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex-1 min-h-0 p-1">
        <BlockContent block={block} layout={{ width: layout.width, height: layout.height }} chartCategoryLabel={chartCategoryLabel} chartData={chartData} tableRowCount={tableRowCount} selectedColumnsCount={selectedColumnsCount} onTextChange={onTextChange} />
      </div>
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-primary/50 rounded-tl border border-primary shrink-0"
        onPointerDown={(e) => { e.stopPropagation(); onResizeStart(e, { ...block, ...layout }); }}
        aria-label="Resize"
      />
    </div>
  );
}

const PIE_COLORS = ["hsl(var(--primary))", "hsl(215 20% 55%)", "hsl(262 83% 58%)", "hsl(189 94% 43%)", "hsl(38 92% 50%)"];
const barChartConfig = { count: { label: "Providers", color: "hsl(var(--primary))" } };
const pieChartConfig = { count: { label: "Providers", color: "hsl(var(--primary))" } };

/** Renders real chart/table/summary content for the preview (same as export result). */
function PreviewBlockContent({
  block,
  layout,
  chartCategory,
  chartCategoryLabel,
  chartData,
  chartDataForPie,
  tableRowCount,
  tableColumns,
  selectedColumns,
  tableRows,
}: {
  block: ReportBlock;
  layout: { width: number; height: number };
  chartCategory: ChartCategoryKey;
  chartCategoryLabel: string;
  chartData: { name: string; count: number }[];
  chartDataForPie: { name: string; count: number }[];
  tableRowCount: number;
  tableColumns: readonly { id: string; label: string }[];
  selectedColumns: string[];
  tableRows: Record<string, string>[];
}) {
  const isPie = chartCategory === "status" || chartCategory === "type";
  const cols = tableColumns.filter((c) => selectedColumns.includes(c.id));
  const displayRows = tableRows.slice(0, 12);

  switch (block.type) {
    case "chart":
      return (
        <div className="w-full overflow-hidden rounded bg-background/50 p-1" style={{ height: Math.max(layout.height - 8, 48) }}>
          <ChartContainer config={isPie ? pieChartConfig : barChartConfig} className="h-full w-full" style={{ height: "100%" }}>
            {isPie ? (
              <PieChart data={chartDataForPie} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <Pie dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {chartDataForPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 8 }} />
                <YAxis tickLine={false} axisLine={false} width={20} tick={{ fontSize: 8 }} />
                <Bar dataKey="count" radius={[2, 2, 0, 0]} fill="var(--color-count)" />
              </BarChart>
            )}
          </ChartContainer>
        </div>
      );
    case "table":
      return (
        <div className="h-full w-full overflow-auto rounded bg-background/50 p-0.5">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                {cols.map((c) => (
                  <th key={c.id} className="text-left font-medium p-0.5 truncate max-w-[60px]">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  {cols.map((c) => (
                    <td key={c.id} className="p-0.5 truncate max-w-[60px]" title={row[c.id]}>{row[c.id] ?? "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {tableRowCount > displayRows.length && (
            <p className="text-[9px] text-muted-foreground p-0.5">+{tableRowCount - displayRows.length} more rows</p>
          )}
        </div>
      );
    case "summary":
      return (
        <div className="h-full w-full overflow-hidden rounded bg-background/50 p-2 text-xs text-muted-foreground">
          <p>Generated: {new Date().toLocaleDateString()}</p>
          <p>Total rows: {tableRowCount}</p>
        </div>
      );
    case "text":
      return (
        <div className="h-full w-full overflow-hidden rounded bg-background/50 p-1.5 text-xs whitespace-pre-wrap">
          {block.text?.trim() || "—"}
        </div>
      );
    default:
      return null;
  }
}

/** Read-only preview of the report as it would appear (real chart, table, and content). */
function ReportPreview({
  value,
  orientation,
  chartCategory,
  chartCategoryLabel,
  chartData,
  chartDataForPie,
  tableRowCount,
  tableColumns,
  selectedColumns,
  tableRows,
}: {
  value: ReportBuilderValue;
  orientation: PageOrientation;
  chartCategory: ChartCategoryKey;
  chartCategoryLabel: string;
  chartData: { name: string; count: number }[];
  chartDataForPie: { name: string; count: number }[];
  tableRowCount: number;
  tableColumns: readonly { id: string; label: string }[];
  selectedColumns: string[];
  tableRows: Record<string, string>[];
}) {
  const size = getCanvasSize(orientation);
  return (
    <div
      className="rounded-lg bg-white shadow-md border border-border overflow-hidden flex-shrink-0"
      style={{ width: size.width, height: size.height }}
    >
      <div className="relative w-full h-full" style={{ width: size.width, height: size.height }}>
        {value.title && <div className="absolute left-2 top-2 text-sm font-semibold text-foreground truncate" style={{ maxWidth: size.width - 16 }}>{value.title}</div>}
        {value.subtitle && <div className="absolute left-2 top-6 text-xs text-muted-foreground truncate" style={{ maxWidth: size.width - 16 }}>{value.subtitle}</div>}
        {value.blocks.map((block, index) => {
          const layout = getBlockLayout(block, index, value.blocks, size.width, size.height);
          return (
            <div
              key={block.id}
              className="absolute rounded border border-border bg-white overflow-hidden"
              style={{ left: layout.x, top: layout.y, width: layout.width, height: layout.height }}
            >
              <div className="h-full w-full overflow-hidden p-0.5">
                <PreviewBlockContent
                  block={block}
                  layout={{ width: layout.width, height: layout.height }}
                  chartCategory={chartCategory}
                  chartCategoryLabel={chartCategoryLabel}
                  chartData={chartData}
                  chartDataForPie={chartDataForPie}
                  tableRowCount={tableRowCount}
                  tableColumns={tableColumns}
                  selectedColumns={selectedColumns}
                  tableRows={tableRows}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ReportBuilder({
  value,
  onChange,
  orientation,
  tableColumns,
  selectedColumns,
  onToggleColumn,
  chartCategory,
  chartCategoryLabel,
  chartData,
  chartDataForPie,
  tableRowCount,
  tableRows,
}: ReportBuilderProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const size = getCanvasSize(orientation);
  const canvasWidth = size.width;
  const canvasHeight = size.height;

  // Drag from palette: type we're dragging, cursor position (viewport)
  const [paletteDrag, setPaletteDrag] = useState<{ type: ReportBlockType; clientX: number; clientY: number } | null>(null);

  // Drag block: block id and offset from pointer to block top-left (in canvas coords)
  const [blockDrag, setBlockDrag] = useState<{ blockId: string; offsetX: number; offsetY: number } | null>(null);

  const resizeRef = useRef<{
    blockId: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    layoutX: number;
    layoutY: number;
  } | null>(null);

  const addBlock = (type: ReportBlockType, atCursor?: { x: number; y: number }) => {
    const newBlock = createBlock(type, value.blocks, atCursor, canvasWidth, canvasHeight);
    onChange({ ...value, blocks: [...value.blocks, newBlock] });
  };

  const removeBlock = (id: string) => {
    onChange({ ...value, blocks: value.blocks.filter((b) => b.id !== id) });
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const updateBlock = (id: string, upd: Partial<ReportBlock>) => {
    onChange({ ...value, blocks: value.blocks.map((b) => (b.id === id ? { ...b, ...upd } : b)) });
  };

  // —— Palette: drag to add (Figma-style) ——
  const handlePalettePointerDown = useCallback(
    (e: React.PointerEvent, assetType: ReportBlockType) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      setPaletteDrag({ type: assetType, clientX: e.clientX, clientY: e.clientY });
      const onMove = (ev: PointerEvent) => setPaletteDrag((prev) => (prev ? { ...prev, clientX: ev.clientX, clientY: ev.clientY } : null));
      const onUp = (ev: PointerEvent) => {
        if (canvasRef.current && isPointInCanvas(canvasRef.current, ev.clientX, ev.clientY)) {
          const { x, y } = getCanvasCoords(canvasRef.current, ev.clientX, ev.clientY);
          addBlock(assetType, {
            x: Math.max(0, Math.min(canvasWidth - DEFAULT_BLOCK_WIDTH, x)),
            y: Math.max(0, Math.min(canvasHeight - DEFAULT_BLOCK_HEIGHT, y)),
          });
        }
        setPaletteDrag(null);
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [value.blocks, onChange, canvasWidth, canvasHeight],
  );

  // —— Block: drag to move (Figma-style, 1:1 with cursor) ——
  const handleBlockDragStart = useCallback(
    (e: React.PointerEvent, blockId: string) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      const block = value.blocks.find((b) => b.id === blockId);
      const index = block ? value.blocks.indexOf(block) : -1;
      if (block == null || index < 0) return;
      const layout = getBlockLayout(block, index, value.blocks, canvasWidth, canvasHeight);
      const canvas = getCanvasCoords(canvasRef.current, e.clientX, e.clientY);
      const offsetX = canvas.x - layout.x;
      const offsetY = canvas.y - layout.y;
      setBlockDrag({ blockId, offsetX, offsetY });
      const onMove = (ev: PointerEvent) => {
        const c = getCanvasCoords(canvasRef.current, ev.clientX, ev.clientY);
        const newX = Math.max(0, Math.min(canvasWidth - layout.width, c.x - offsetX));
        const newY = Math.max(0, Math.min(canvasHeight - layout.height, c.y - offsetY));
        updateBlock(blockId, { x: newX, y: newY });
      };
      const onUp = () => {
        setBlockDrag(null);
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [value.blocks, onChange, canvasWidth, canvasHeight],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (resizeRef.current) {
        const { blockId, startX, startY, startW, startH, layoutX, layoutY } = resizeRef.current;
        const dw = e.clientX - startX;
        const dh = e.clientY - startY;
        const newW = Math.max(MIN_BLOCK_WIDTH, Math.min(canvasWidth - layoutX, startW + dw));
        const newH = Math.max(MIN_BLOCK_HEIGHT, Math.min(canvasHeight - layoutY, startH + dh));
        updateBlock(blockId, { width: newW, height: newH });
      }
    },
    [updateBlock, canvasWidth, canvasHeight],
  );

  const handlePointerUp = useCallback(() => {
    if (resizeRef.current) {
      resizeRef.current = null;
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    }
  }, [handlePointerMove]);

  const handleResizeStart = useCallback(
    (e: React.PointerEvent, block: ReportBlock & { x?: number; y?: number; width?: number; height?: number }) => {
      e.preventDefault();
      const layout = getBlockLayout(block, value.blocks.findIndex((b) => b.id === block.id), value.blocks, canvasWidth, canvasHeight);
      resizeRef.current = { blockId: block.id, startX: e.clientX, startY: e.clientY, startW: layout.width, startH: layout.height, layoutX: layout.x, layoutY: layout.y };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [value.blocks, handlePointerMove, handlePointerUp, canvasWidth, canvasHeight],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Assets</Label>
        <p className="text-xs text-muted-foreground mb-2">Drag onto the canvas or click + to add.</p>
        <div className="space-y-1.5">
          {ASSET_PALETTE.map(({ type, label, icon }) => (
            <PaletteItem key={type} type={type} label={label} icon={icon} onAdd={() => addBlock(type)} onDragStart={handlePalettePointerDown} />
          ))}
        </div>
      </div>

      <div className="space-y-3 flex-1 min-w-0">
        <Label className="text-xs font-medium text-muted-foreground">Report content</Label>
        <div className="space-y-2">
          <Input placeholder="Report title" value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} className="text-lg font-semibold border-0 bg-transparent px-0 focus-visible:ring-0" />
          <Input placeholder="Subtitle or description (optional)" value={value.subtitle} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} className="text-sm text-muted-foreground border-0 bg-transparent px-0 focus-visible:ring-0" />
        </div>

        <div className="flex flex-wrap gap-6 items-start">
          {/* Figma-style canvas: fixed artboard, orientation-aware */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Canvas ({orientation})</p>
            <div
              ref={canvasRef}
              onClick={() => setSelectedBlockId(null)}
              className="relative rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 overflow-hidden select-none"
              style={{ width: canvasWidth, height: canvasHeight }}
            >
              {value.blocks.map((block, index) => (
                <CanvasBlock
                  key={block.id}
                  block={block}
                  layout={getBlockLayout(block, index, value.blocks, canvasWidth, canvasHeight)}
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                  isSelected={selectedBlockId === block.id}
                  isDragging={blockDrag?.blockId === block.id}
                  onSelect={() => setSelectedBlockId(block.id)}
                  onDragHandlePointerDown={(e) => handleBlockDragStart(e, block.id)}
                  chartCategoryLabel={chartCategoryLabel}
                  chartData={chartData}
                  tableRowCount={tableRowCount}
                  selectedColumnsCount={selectedColumns.length || tableColumns.length}
                  onRemove={() => removeBlock(block.id)}
                  onTextChange={block.type === "text" ? (text) => updateBlock(block.id, { text }) : undefined}
                  onUpdate={(upd) => updateBlock(block.id, upd)}
                  onResizeStart={handleResizeStart}
                />
              ))}
              {value.blocks.length === 0 && (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground pointer-events-none">Drag assets here or add from the list.</p>
              )}
            </div>
          </div>

          {/* Preview: shows result when user releases assets */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Preview</p>
            <ReportPreview
              value={value}
              orientation={orientation}
              chartCategory={chartCategory}
              chartCategoryLabel={chartCategoryLabel}
              chartData={chartData}
              chartDataForPie={chartDataForPie}
              tableRowCount={tableRowCount}
              tableColumns={tableColumns}
              selectedColumns={selectedColumns.length ? selectedColumns : tableColumns.map((c) => c.id)}
              tableRows={tableRows}
            />
          </div>
        </div>

        {/* Ghost when dragging from palette: follows cursor 1:1 */}
        {paletteDrag && (
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: paletteDrag.clientX,
              top: paletteDrag.clientY,
              transform: "translate(10px, 10px)",
            }}
          >
            {(() => {
              const a = ASSET_PALETTE.find((x) => x.type === paletteDrag.type);
              const Icon = a?.icon ?? FileText;
              return (
                <div className="rounded-lg border-2 border-primary bg-background shadow-xl flex items-center gap-2 px-3 py-2 text-sm">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{a?.label ?? "Asset"}</span>
                </div>
              );
            })()}
          </div>
        )}

        <div className="space-y-2 pt-2">
          <Label className="text-xs font-medium text-muted-foreground">Table columns (for Table asset and CSV)</Label>
          <div className="flex flex-wrap gap-3 rounded-lg border bg-muted/30 p-3">
            {tableColumns.map((col) => (
              <label key={col.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={selectedColumns.includes(col.id)} onCheckedChange={() => onToggleColumn(col.id)} />
                <span className="text-sm">{col.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
