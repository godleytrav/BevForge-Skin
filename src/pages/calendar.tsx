import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';

type ViewMode = 'day' | 'week' | 'month';

// Sample events data
const sampleEvents = [
  { id: 1, title: 'Batch #2847 - Quality Check', time: '09:00 AM', duration: '1h', type: 'batch', priority: 'high' },
  { id: 2, title: 'Team Meeting - Production Review', time: '10:30 AM', duration: '45m', type: 'meeting', priority: 'medium' },
  { id: 3, title: 'Order #5621 - Delivery Scheduled', time: '02:00 PM', duration: '30m', type: 'order', priority: 'high' },
  { id: 4, title: 'Equipment Maintenance', time: '03:30 PM', duration: '2h', type: 'maintenance', priority: 'medium' },
  { id: 5, title: 'Compliance Report Due', time: '05:00 PM', duration: '1h', type: 'compliance', priority: 'high' },
];

const timeSlots = [
  '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handlePrevious = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, -1));
    } else {
      setCurrentDate(addMonths(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayDoubleClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  const getDateRange = () => {
    if (viewMode === 'day') {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getMonthDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'batch': return 'bg-blue-500';
      case 'meeting': return 'bg-purple-500';
      case 'order': return 'bg-green-500';
      case 'maintenance': return 'bg-orange-500';
      case 'compliance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header with View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">Manage your schedule and events</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <div className="flex items-center gap-1 border rounded-lg p-1">
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

        {/* Navigation Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold ml-2">{getDateRange()}</h2>
              </div>

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
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setCurrentDate(date);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card>
          <CardContent className="p-0">
            {/* Day View */}
            {viewMode === 'day' && (
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Header */}
                  <div className="grid grid-cols-[80px_1fr] border-b">
                    <div className="p-4 border-r bg-muted/50"></div>
                    <div className="p-4 text-center font-semibold">
                      {format(currentDate, 'EEEE, MMM d')}
                    </div>
                  </div>
                  {/* Time Slots */}
                  <div className="max-h-[600px] overflow-y-auto">
                    {timeSlots.map((time, idx) => (
                      <div key={idx} className="grid grid-cols-[80px_1fr] border-b min-h-[60px]">
                        <div className="p-2 border-r text-sm text-muted-foreground text-right pr-4">
                          {time}
                        </div>
                        <div className="p-2 hover:bg-muted/50 cursor-pointer">
                          {/* Events would go here */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Week View */}
            {viewMode === 'week' && (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b">
                    <div className="p-4 border-r bg-muted/50"></div>
                    {getWeekDays().map((day, idx) => (
                      <div
                        key={idx}
                        className={`p-4 text-center border-r ${
                          isToday(day) ? 'bg-primary/10' : ''
                        }`}
                      >
                        <div className="text-sm text-muted-foreground">
                          {format(day, 'EEE')}
                        </div>
                        <div className={`text-lg font-semibold ${
                          isToday(day) ? 'text-primary' : ''
                        }`}>
                          {format(day, 'd')}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Time Slots */}
                  <div className="max-h-[600px] overflow-y-auto">
                    {timeSlots.map((time, idx) => (
                      <div key={idx} className="grid grid-cols-[80px_repeat(7,1fr)] border-b min-h-[60px]">
                        <div className="p-2 border-r text-sm text-muted-foreground text-right pr-4">
                          {time}
                        </div>
                        {getWeekDays().map((day, dayIdx) => (
                          <div
                            key={dayIdx}
                            className={`p-2 border-r hover:bg-muted/50 cursor-pointer ${
                              isToday(day) ? 'bg-primary/5' : ''
                            }`}
                          >
                            {/* Events would go here */}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Month View */}
            {viewMode === 'month' && (
              <div className="p-4">
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                  {/* Calendar Days */}
                  {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="aspect-square"></div>
                  ))}
                  {getMonthDays().map((day, idx) => (
                    <div
                      key={idx}
                      onDoubleClick={() => handleDayDoubleClick(day)}
                      className={`aspect-square border rounded-lg p-2 hover:bg-muted/50 cursor-pointer ${
                        isToday(day) ? 'bg-primary/10 border-primary' : ''
                      } ${!isSameMonth(day, currentDate) ? 'text-muted-foreground' : ''}`}
                    >
                      <div className={`text-sm font-semibold ${
                        isToday(day) ? 'text-primary' : ''
                      }`}>
                        {format(day, 'd')}
                      </div>
                      {/* Event indicators */}
                      <div className="mt-1 space-y-1">
                        {isToday(day) && (
                          <>
                            <div className="h-1 w-full bg-blue-500 rounded"></div>
                            <div className="h-1 w-full bg-green-500 rounded"></div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-1 h-full ${getEventTypeColor(event.type)} rounded-full`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.time} • {event.duration}
                        </p>
                      </div>
                      <Badge variant={event.priority === 'high' ? 'destructive' : 'secondary'}>
                        {event.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
