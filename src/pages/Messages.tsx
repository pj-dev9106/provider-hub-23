import { useState } from "react";
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical,
  Check,
  CheckCheck,
  Bell,
  Archive,
  Trash2,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const conversations = [
  {
    id: 1,
    name: "Dr. Michael Chen",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Can you cover the afternoon shift tomorrow?",
    time: "10 min ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "HR Department",
    avatar: null,
    lastMessage: "Your background check has been completed successfully.",
    time: "1 hour ago",
    unread: 1,
    online: false,
  },
  {
    id: 3,
    name: "Scheduling Team",
    avatar: null,
    lastMessage: "Your shift swap request has been approved.",
    time: "3 hours ago",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Nurse Manager - Lisa Park",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Great work on the night shift coverage!",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: 5,
    name: "IT Support",
    avatar: null,
    lastMessage: "Your badge access has been updated.",
    time: "2 days ago",
    unread: 0,
    online: false,
  },
];

const messages = [
  {
    id: 1,
    senderId: "other",
    text: "Hi Sarah! I hope you're doing well.",
    time: "10:30 AM",
    status: "read",
  },
  {
    id: 2,
    senderId: "other",
    text: "Can you cover the afternoon shift tomorrow? We're short-staffed in ICU.",
    time: "10:31 AM",
    status: "read",
  },
  {
    id: 3,
    senderId: "me",
    text: "Hi Dr. Chen! Let me check my schedule.",
    time: "10:35 AM",
    status: "read",
  },
  {
    id: 4,
    senderId: "me",
    text: "Yes, I can cover! What time do you need me?",
    time: "10:36 AM",
    status: "delivered",
  },
  {
    id: 5,
    senderId: "other",
    text: "That's great! The shift is from 3 PM to 11 PM. Thank you so much!",
    time: "10:38 AM",
    status: "read",
  },
];

const notifications = [
  {
    id: 1,
    type: "alert",
    title: "License Expiring Soon",
    message: "Your RN license expires in 30 days. Please renew to maintain compliance.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Shift Confirmed",
    message: "Your shift on Feb 5 at ICU has been confirmed.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "New Training Available",
    message: "COVID-19 Protocol Update training is now available.",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "success",
    title: "Timesheet Approved",
    message: "Your timesheet for Jan 20-26 has been approved.",
    time: "2 days ago",
    read: true,
  },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Communicate with your team and stay updated
          </p>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="messages" className="relative">
              Messages
              <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                3
              </span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              <span className="ml-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                2
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-0">
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
                {/* Conversations List */}
                <div className="border-r border-border">
                  <div className="p-4 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search messages..." className="pl-10" />
                    </div>
                  </div>
                  <ScrollArea className="h-[540px]">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={cn(
                          "w-full p-4 flex items-start gap-3 hover:bg-secondary/50 transition-colors text-left",
                          selectedConversation.id === conv.id && "bg-secondary/50"
                        )}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            {conv.avatar && <AvatarImage src={conv.avatar} />}
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {conv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          {conv.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-card" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn(
                              "font-medium truncate",
                              conv.unread > 0 && "text-foreground"
                            )}>
                              {conv.name}
                            </p>
                            <span className="text-xs text-muted-foreground shrink-0">{conv.time}</span>
                          </div>
                          <p className={cn(
                            "text-sm truncate mt-0.5",
                            conv.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                          )}>
                            {conv.lastMessage}
                          </p>
                        </div>
                        {conv.unread > 0 && (
                          <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </button>
                    ))}
                  </ScrollArea>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-2 flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {selectedConversation.avatar && <AvatarImage src={selectedConversation.avatar} />}
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {selectedConversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedConversation.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedConversation.online ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            msg.senderId === "me" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2.5",
                              msg.senderId === "me"
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-secondary text-foreground rounded-bl-md"
                            )}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <div className={cn(
                              "flex items-center justify-end gap-1 mt-1",
                              msg.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              <span className="text-xs">{msg.time}</span>
                              {msg.senderId === "me" && (
                                msg.status === "read" ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-end gap-2">
                      <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Textarea
                        placeholder="Type a message..."
                        className="min-h-[44px] max-h-32 resize-none"
                        rows={1}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <Button size="icon" className="h-10 w-10 shrink-0 bg-gradient-primary hover:opacity-90">
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Notifications</CardTitle>
                  <Button variant="ghost" size="sm">
                    Mark all as read
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-4 rounded-lg transition-colors cursor-pointer",
                      notif.read ? "hover:bg-secondary/30" : "bg-secondary/30 hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        notif.type === "alert" ? "bg-warning/10" :
                        notif.type === "success" ? "bg-success/10" :
                        "bg-info/10"
                      )}>
                        <Bell className={cn(
                          "h-4 w-4",
                          notif.type === "alert" ? "text-warning" :
                          notif.type === "success" ? "text-success" :
                          "text-info"
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "font-medium",
                            !notif.read && "text-foreground"
                          )}>{notif.title}</p>
                          <span className="text-xs text-muted-foreground">{notif.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
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
