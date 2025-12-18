import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Package, ShoppingCart, FileText, AlertCircle } from 'lucide-react';

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock events for the selected date
  const events = [
    {
      id: 1,
      type: 'batch',
      title: 'IPA #42 - Start Fermentation',
      time: '09:00 AM',
      status: 'scheduled',
      icon: Package,
    },
    {
      id: 2,
      type: 'order',
      title: 'Order #1234 - Delivery Due',
      time: '02:00 PM',
      status: 'pending',
      icon: ShoppingCart,
    },
    {
      id: 3,
      type: 'compliance',
      title: 'TTB Report Deadline',
      time: '05:00 PM',
      status: 'urgent',
      icon: FileText,
    },
  ];

  const upcomingEvents = [
    { date: 'Tomorrow', title: 'Batch #43 - Conditioning Complete', type: 'batch' },
    { date: 'Dec 20', title: 'Inventory Audit', type: 'compliance' },
    { date: 'Dec 22', title: 'Order #1235 - Fulfillment', type: 'order' },
    { date: 'Dec 25', title: 'Holiday - Brewery Closed', type: 'other' },
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Track batches, orders, and compliance deadlines</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Calendar */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>View and manage your brewery schedule</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Events</CardTitle>
            <CardDescription>
              {date?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    event.status === 'urgent' ? 'bg-destructive/10' :
                    event.status === 'pending' ? 'bg-yellow-500/10' :
                    'bg-primary/10'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      event.status === 'urgent' ? 'text-destructive' :
                      event.status === 'pending' ? 'text-yellow-600' :
                      'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Event Types Legend */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Event Types</CardTitle>
            <CardDescription>Calendar event categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">Batches</p>
                  <p className="text-xs text-muted-foreground">Production schedule</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Orders</p>
                  <p className="text-xs text-muted-foreground">Delivery & fulfillment</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Compliance</p>
                  <p className="text-xs text-muted-foreground">TTB/ABC deadlines</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <div>
                  <p className="text-sm font-medium">Urgent</p>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  {index < upcomingEvents.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>This Week</CardTitle>
            <CardDescription>Activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <Package className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Batches Scheduled</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <ShoppingCart className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Orders Due</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <FileText className="h-8 w-8 text-yellow-500 mb-2" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Compliance Tasks</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Urgent Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
