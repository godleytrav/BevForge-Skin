import { useState } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AppShell } from '@/components/AppShell';

type ViewMode = 'day' | 'week' | 'month';

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: 'batch' | 'meeting' | 'order' | 'maintenance' | 'compliance';
  priority: 'high' | 'medium' | 'low';
  date: Date;
};

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Batch #2847 - IPA Brewing', time: '09:00', duration: '4h', type: 'batch', priority: 'high', date: new Date() },
  { id: '2', title: 'Team Meeting - Production Review', time: '14:00', duration: '1h', type: 'meeting', priority: 'medium', date: new Date() },
  { id: '3', title: 'Order #1923 - Delivery Scheduled', time: '16:00', duration: '2h', type: 'order', priority: 'high', date: new Date() },
  { id: '4', title: 'Equipment Maintenance - Tank 3', time: '10:00', duration: '3h', type: 'maintenance', priority: 'medium', date: addDays(new Date(), 1) },
  { id: '5', title: 'Compliance Audit - Health Inspection', time: '11:00', duration: '2h', type: 'compliance', priority: 'high', date: addDays(new Date(), 2) },
];

const eventTypeColors = {
  batch: 'bg-blue-500',
  meeting: 'bg-purple-500',
  order: 'bg-green-500',
  maintenance: 'bg-orange-500',
  compliance: 'bg-red-500',
};

const priorityColors = {
  high: 'border-red-500',
  medium: 'border-yellow-500',
  low: 'border-gray-500',
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration: '1h',
    type: 'batch' as CalendarEvent['type'],
    priority: 'medium' as CalendarEvent['priority'],
    description: '',
  });

  const handlePrevious = () => {
    if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1));
    if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
  };



  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      setSelectedDate(date);
    }
  };

  const handleDayDoubleClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  const handleAddEvent = () => {
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      time: newEvent.time,
      duration: newEvent.duration,
      type: newEvent.type,
      priority: newEvent.priority,
      date: new Date(newEvent.date),
    };
    setEvents([...events, event]);
    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      duration: '1h',
      type: 'batch',
      priority: 'medium',
      description: '',
    });
  };

  const getDateRange = () => {
    if (viewMode === 'day') return format(currentDate, 'EEEE, MMMM d, yyyy');
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    return format(currentDate, 'MMMM yyyy');
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  };

  const getTodayEvents = () => {
    return events.filter(event => format(event.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'));
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDate(currentDate);

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[80px_1fr]">
          {/* Time column */}
          <div className="border-r bg-muted/30">
            <div className="h-12 border-b" /> {/* Header spacer */}
            {hours.map(hour => (
              <div key={hour} className="h-16 border-b text-sm text-muted-foreground text-right pr-4 pt-1">
                {format(new Date().setHours(hour, 0), 'h a')}
              </div>
            ))}
          </div>

          {/* Day column */}
          <div>
            <div className="h-12 border-b bg-muted/50 flex items-center justify-center font-medium">
              {format(currentDate, 'EEEE, MMM d')}
            </div>
            <div className="relative">
              {hours.map(hour => (
                <div key={hour} className="h-16 border-b" />
              ))}
              {/* Events overlay */}
              {dayEvents.map(event => {
                const [eventHour] = event.time.split(':').map(Number);
                const top = eventHour * 64; // 64px per hour (h-16)
                return (
                  <div
                    key={event.id}
                    className={`absolute left-2 right-2 ${eventTypeColors[event.type]} text-white p-2 rounded text-sm shadow-md`}
                    style={{ top: `${top}px`, height: '60px' }}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs opacity-90">{event.time} • {event.duration}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(currentDate) });
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {/* Time column */}
          <div className="border-r bg-muted/30">
            <div className="h-12 border-b" /> {/* Header spacer */}
            {hours.map(hour => (
              <div key={hour} className="h-16 border-b text-sm text-muted-foreground text-right pr-4 pt-1">
                {format(new Date().setHours(hour, 0), 'h a')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map(day => {
            const dayEvents = getEventsForDate(day);
            return (
              <div key={day.toString()} className="border-r last:border-r-0">
                <div className={`h-12 border-b flex flex-col items-center justify-center ${isToday(day) ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
                  <div className="text-xs">{format(day, 'EEE')}</div>
                  <div className="font-medium">{format(day, 'd')}</div>
                </div>
                <div className="relative">
                  {hours.map(hour => (
                    <div key={hour} className="h-16 border-b" />
                  ))}
                  {/* Events overlay */}
                  {dayEvents.map(event => {
                    const [eventHour] = event.time.split(':').map(Number);
                    const top = eventHour * 64;
                    return (
                      <div
                        key={event.id}
                        className={`absolute left-1 right-1 ${eventTypeColors[event.type]} text-white p-1 rounded text-xs shadow-md overflow-hidden`}
                        style={{ top: `${top}px`, height: '60px' }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-90">{event.time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 border-b bg-muted/50 text-center font-medium text-sm">
              {day}
            </div>
          ))}
          {monthDays.map(day => {
            const dayEvents = getEventsForDate(day);
            return (
              <div
                key={day.toString()}
                onDoubleClick={() => handleDayDoubleClick(day)}
                className={`min-h-24 p-2 border-b border-r cursor-pointer hover:bg-muted/50 transition-colors ${
                  !isSameMonth(day, currentDate) ? 'bg-muted/20 text-muted-foreground' : ''
                } ${isToday(day) ? 'bg-primary/10' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded ${eventTypeColors[event.type]} text-white truncate`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AppShell>
      <div className="flex gap-6 h-full">
        {/* Main Calendar Area */}
        <div className="flex-1 space-y-4">
          {/* Header Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevious}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          Today's Events
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium">Today's Events</h4>
                          {getTodayEvents().length === 0 ? (
                            <p className="text-sm text-muted-foreground">No events scheduled for today</p>
                          ) : (
                            <div className="space-y-2">
                              {getTodayEvents().map(event => (
                                <div key={event.id} className={`p-3 border-l-4 ${priorityColors[event.priority]} bg-card rounded`}>
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium">{event.title}</div>
                                      <div className="text-sm text-muted-foreground mt-1">
                                        {event.time} • {event.duration}
                                      </div>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {event.type}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button variant="outline" size="icon" onClick={handleNext}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-lg font-semibold">{getDateRange()}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Jump to Date
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add New Event</DialogTitle>
                        <DialogDescription>
                          Create a new event on your calendar
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Event Title</Label>
                          <Input
                            id="title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            placeholder="e.g., Batch #2847 - IPA Brewing"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={newEvent.date}
                              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              type="time"
                              value={newEvent.time}
                              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="type">Event Type</Label>
                            <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value as CalendarEvent['type'] })}>
                              <SelectTrigger id="type">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="batch">Batch</SelectItem>
                                <SelectItem value="meeting">Meeting</SelectItem>
                                <SelectItem value="order">Order</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="compliance">Compliance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={newEvent.priority} onValueChange={(value) => setNewEvent({ ...newEvent, priority: value as CalendarEvent['priority'] })}>
                              <SelectTrigger id="priority">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="duration">Duration</Label>
                          <Select value={newEvent.duration} onValueChange={(value) => setNewEvent({ ...newEvent, duration: value })}>
                            <SelectTrigger id="duration">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30m">30 minutes</SelectItem>
                              <SelectItem value="1h">1 hour</SelectItem>
                              <SelectItem value="2h">2 hours</SelectItem>
                              <SelectItem value="3h">3 hours</SelectItem>
                              <SelectItem value="4h">4 hours</SelectItem>
                              <SelectItem value="8h">8 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description (Optional)</Label>
                          <Textarea
                            id="description"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            placeholder="Add notes or details about this event..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddEvent} disabled={!newEvent.title}>
                          Add Event
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <div className="flex gap-1 border rounded-md p-1">
                    <Button
                      variant={viewMode === 'day' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('day')}
                    >
                      Day
                    </Button>
                    <Button
                      variant={viewMode === 'week' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('week')}
                    >
                      Week
                    </Button>
                    <Button
                      variant={viewMode === 'month' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('month')}
                    >
                      Month
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar View */}
          {viewMode === 'day' && renderDayView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'month' && renderMonthView()}
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-4">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getUpcomingEvents().map(event => (
                <div key={event.id} className={`p-3 border-l-4 ${priorityColors[event.priority]} bg-card rounded`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-sm">{event.title}</div>
                    <Badge variant="secondary" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(event.date, 'MMM d')} • {event.time} • {event.duration}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Event Types Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(eventTypeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${color}`} />
                  <span className="text-sm capitalize">{type}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Events</span>
                <span className="font-semibold">{events.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">High Priority</span>
                <span className="font-semibold text-red-500">
                  {events.filter(e => e.priority === 'high').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Batches</span>
                <span className="font-semibold text-blue-500">
                  {events.filter(e => e.type === 'batch').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
