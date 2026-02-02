import { useState } from "react";
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  MoreVertical,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const documents = [
  {
    id: 1,
    name: "RN License - California",
    type: "License",
    status: "approved",
    expires: "Dec 15, 2025",
    uploadedDate: "Dec 20, 2023",
    daysUntilExpiry: 320,
  },
  {
    id: 2,
    name: "BLS Certification",
    type: "Certification",
    status: "approved",
    expires: "Aug 10, 2025",
    uploadedDate: "Aug 15, 2023",
    daysUntilExpiry: 193,
  },
  {
    id: 3,
    name: "ACLS Certification",
    type: "Certification",
    status: "expiring",
    expires: "Feb 28, 2025",
    uploadedDate: "Feb 28, 2023",
    daysUntilExpiry: 30,
  },
  {
    id: 4,
    name: "TB Test Results",
    type: "Medical",
    status: "pending",
    expires: "Mar 15, 2025",
    uploadedDate: "Jan 25, 2025",
    daysUntilExpiry: 45,
  },
  {
    id: 5,
    name: "Background Check",
    type: "Compliance",
    status: "approved",
    expires: "Mar 2026",
    uploadedDate: "Mar 10, 2024",
    daysUntilExpiry: 400,
  },
  {
    id: 6,
    name: "COVID-19 Vaccination Record",
    type: "Medical",
    status: "rejected",
    expires: "N/A",
    uploadedDate: "Jan 20, 2025",
    daysUntilExpiry: null,
    rejectionReason: "Document is unclear. Please reupload.",
  },
];

const contracts = [
  { id: 1, name: "Employment Agreement 2024", date: "Jan 1, 2024", signed: true },
  { id: 2, name: "NDA Agreement", date: "Mar 15, 2022", signed: true },
  { id: 3, name: "W-4 Form", date: "Mar 15, 2022", signed: true },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "pending":
      return <Clock className="h-4 w-4 text-warning" />;
    case "expiring":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge className="status-approved border">Approved</Badge>;
    case "pending":
      return <Badge className="status-pending border">Pending Review</Badge>;
    case "expiring":
      return <Badge className="status-pending border">Expiring Soon</Badge>;
    case "rejected":
      return <Badge className="status-rejected border">Rejected</Badge>;
    default:
      return null;
  }
};

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: documents.length,
    approved: documents.filter(d => d.status === "approved").length,
    pending: documents.filter(d => d.status === "pending").length,
    expiring: documents.filter(d => d.status === "expiring").length,
    rejected: documents.filter(d => d.status === "rejected").length,
  };

  const compliancePercent = Math.round((stats.approved / stats.total) * 100);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Documents & Credentials</h1>
            <p className="text-muted-foreground mt-1">
              Manage your licenses, certifications, and compliance documents
            </p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance</p>
                  <p className="text-2xl font-bold text-foreground">{compliancePercent}%</p>
                </div>
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              </div>
              <Progress value={compliancePercent} className="h-1.5 mt-3" />
            </CardContent>
          </Card>
          
          <Card className="card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-success">{stats.approved}</p>
                </div>
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                </div>
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Action Needed</p>
                  <p className="text-2xl font-bold text-destructive">{stats.expiring + stats.rejected}</p>
                </div>
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="credentials" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="contracts">Contracts & Agreements</TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="space-y-4">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Documents List */}
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredDocs.map((doc) => (
                    <div 
                      key={doc.id}
                      className="p-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${
                            doc.status === 'rejected' ? 'bg-destructive/10' :
                            doc.status === 'expiring' ? 'bg-warning/10' :
                            doc.status === 'pending' ? 'bg-warning/10' :
                            'bg-success/10'
                          }`}>
                            <FileText className={`h-5 w-5 ${
                              doc.status === 'rejected' ? 'text-destructive' :
                              doc.status === 'expiring' ? 'text-warning' :
                              doc.status === 'pending' ? 'text-warning' :
                              'text-success'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium text-foreground">{doc.name}</h4>
                              {getStatusBadge(doc.status)}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>Expires: {doc.expires}</span>
                            </div>
                            {doc.status === 'rejected' && doc.rejectionReason && (
                              <p className="text-sm text-destructive mt-2">
                                {doc.rejectionReason}
                              </p>
                            )}
                            {doc.status === 'expiring' && (
                              <p className="text-sm text-warning mt-2">
                                Expires in {doc.daysUntilExpiry} days
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Replace Document</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Signed Agreements</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {contracts.map(contract => (
                  <div 
                    key={contract.id}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{contract.name}</p>
                        <p className="text-sm text-muted-foreground">Signed on {contract.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="status-approved border">Signed</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
