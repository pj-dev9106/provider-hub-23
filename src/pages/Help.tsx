import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageSquare, 
  Phone, 
  Mail,
  ChevronRight,
  ExternalLink,
  FileQuestion
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const quickLinks = [
  { title: "Getting Started Guide", icon: Book, description: "Learn the basics of using the portal" },
  { title: "Submit a Support Ticket", icon: MessageSquare, description: "Get help from our support team" },
  { title: "Schedule FAQ", icon: FileQuestion, description: "Common questions about scheduling" },
  { title: "Contact Admin", icon: Phone, description: "Reach your facility administrator" },
];

const faqs = [
  {
    question: "How do I request time off?",
    answer: "Navigate to Schedule > Request Time Off. Select your dates, provide a reason, and submit. Your manager will be notified and you'll receive a confirmation once approved."
  },
  {
    question: "How do I update my credentials?",
    answer: "Go to Documents & Credentials, click 'Upload Document', select the credential type, upload your file, and fill in the expiration date. Documents are typically reviewed within 24-48 hours."
  },
  {
    question: "How do I swap a shift with another provider?",
    answer: "From your Schedule, click on the shift you want to swap and select 'Swap Shift'. Choose an available colleague and submit the request. Both parties must approve for the swap to complete."
  },
  {
    question: "How do I clock in/out?",
    answer: "Use the 'Clock In' button on your Dashboard or the Time & Attendance page. Make sure you're at the assigned location - some facilities require location verification."
  },
  {
    question: "What happens if I'm late to a shift?",
    answer: "Clock in as soon as you arrive. Late clock-ins are flagged for review. Contact your supervisor if you anticipate being late so they can arrange coverage if needed."
  },
  {
    question: "How do I view my pay statements?",
    answer: "Go to Payments & Compensation to view your earnings summary, payment history, and download pay statements. Tax forms (W-2, 1099) are available in the Tax Forms section."
  },
];

export default function Help() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Help & Support</h1>
          <p className="text-muted-foreground mt-2">
            Find answers, get help, and connect with our support team
          </p>
          
          {/* Search */}
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for help articles..." 
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Card key={link.title} className="card-interactive cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Support</CardTitle>
              <CardDescription>We're here to help</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available 24/7</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  Start Chat
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">Response within 24h</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Phone className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri, 8AM-6PM PT</p>
                  </div>
                </div>
                <p className="text-center font-medium text-primary">1-800-CARE-SHIFT</p>
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="ghost" className="w-full justify-between" asChild>
                  <a href="#" className="flex items-center">
                    View Knowledge Base
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
