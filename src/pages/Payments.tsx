import { 
  DollarSign, 
  TrendingUp, 
  Download, 
  Calendar,
  FileText,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const earningsSummary = {
  currentMonth: "$4,280.00",
  lastMonth: "$3,920.00",
  ytd: "$8,200.00",
  change: "+9.2%",
};

const paymentHistory = [
  {
    id: 1,
    date: "Jan 31, 2025",
    period: "Jan 16 - Jan 31",
    gross: "$2,140.00",
    net: "$1,712.00",
    status: "upcoming",
  },
  {
    id: 2,
    date: "Jan 15, 2025",
    period: "Jan 1 - Jan 15",
    gross: "$2,140.00",
    net: "$1,712.00",
    status: "paid",
  },
  {
    id: 3,
    date: "Dec 31, 2024",
    period: "Dec 16 - Dec 31",
    gross: "$1,960.00",
    net: "$1,568.00",
    status: "paid",
  },
  {
    id: 4,
    date: "Dec 15, 2024",
    period: "Dec 1 - Dec 15",
    gross: "$1,960.00",
    net: "$1,568.00",
    status: "paid",
  },
];

const taxForms = [
  { name: "W-2 (2024)", year: "2024", available: true },
  { name: "W-2 (2023)", year: "2023", available: true },
  { name: "1099-MISC (2024)", year: "2024", available: false },
];

const earningsBreakdown = [
  { label: "Base Pay", amount: "$3,840.00", percent: 90 },
  { label: "Overtime", amount: "$320.00", percent: 7.5 },
  { label: "Shift Differential", amount: "$120.00", percent: 2.5 },
];

export default function Payments() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Payments & Compensation</h1>
            <p className="text-muted-foreground mt-1">
              View your earnings and payment history
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Earnings Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Current Month</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{earningsSummary.currentMonth}</p>
                  <div className="flex items-center gap-1 text-xs font-medium text-success mt-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>{earningsSummary.change} from last month</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Last Month</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{earningsSummary.lastMonth}</p>
                  <p className="text-xs text-muted-foreground mt-2">December 2024</p>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Year to Date</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{earningsSummary.ytd}</p>
                  <p className="text-xs text-muted-foreground mt-2">2025</p>
                </div>
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Next Payment</p>
                  <p className="text-2xl font-bold text-foreground mt-1">$1,712.00</p>
                  <p className="text-xs text-muted-foreground mt-2">Jan 31, 2025</p>
                </div>
                <div className="p-2.5 rounded-xl bg-accent/10">
                  <CreditCard className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earnings Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Earnings Breakdown</CardTitle>
              <CardDescription>Current month breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {earningsBreakdown.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm font-semibold">{item.amount}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Gross</span>
                  <span className="text-lg font-bold text-foreground">$4,280.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Forms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tax Forms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {taxForms.map((form) => (
                <div 
                  key={form.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-card">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{form.name}</p>
                      <p className="text-xs text-muted-foreground">Tax Year {form.year}</p>
                    </div>
                  </div>
                  {form.available ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Payment History</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentHistory.map((payment) => (
              <div 
                key={payment.id}
                className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      payment.status === 'upcoming' ? 'bg-warning/10' : 'bg-success/10'
                    }`}>
                      <DollarSign className={`h-5 w-5 ${
                        payment.status === 'upcoming' ? 'text-warning' : 'text-success'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{payment.period}</p>
                        {payment.status === 'upcoming' ? (
                          <Badge className="status-pending border text-xs">Upcoming</Badge>
                        ) : (
                          <Badge className="status-approved border text-xs">Paid</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{payment.net}</p>
                    <p className="text-xs text-muted-foreground">Net ({payment.gross} gross)</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
