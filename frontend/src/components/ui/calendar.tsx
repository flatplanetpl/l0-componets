'use client';

import { useMemo, useState, useRef, useCallback, type ReactNode, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Trash2, Copy, X, Check, AlertCircle } from 'lucide-react';
import { TextField } from './formFields';

export type CalendarView = 'month' | 'week' | 'day';

export type EventCategory = 'meeting' | 'workshop' | 'demo' | 'personal' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  color?: string;
  category?: EventCategory;
  meta?: ReactNode;
}

export interface CalendarProps {
  events: CalendarEvent[];
  initialDate?: Date;
  initialView?: CalendarView;
  workHours?: { start: number; end: number };
  onViewChange?: (view: CalendarView) => void;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotCreate?: (start: Date, end: Date) => void;
  onEventUpdate?: (eventId: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete?: (eventId: string) => void;
  onEventDuplicate?: (event: CalendarEvent) => void;
  showConflicts?: boolean;
  allowOverlap?: boolean;
}

const DEFAULT_WORK_HOURS = { start: 8, end: 20 };

const CATEGORY_COLORS: Record<EventCategory, string> = {
  meeting: 'bg-blue-500',
  workshop: 'bg-violet-500',
  demo: 'bg-amber-500',
  personal: 'bg-emerald-500',
  other: 'bg-gray-500',
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  meeting: 'Spotkanie',
  workshop: 'Warsztat',
  demo: 'Demo',
  personal: 'Prywatne',
  other: 'Inne',
};

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = next.getDate() - day + (day === 0 ? -6 : 1);
  next.setDate(diff);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function addMonths(date: Date, months: number) {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString(undefined, options);
}

function minutesBetween(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / 60000;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function eventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
  return event1.start < event2.end && event1.end > event2.start;
}

const hourFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
});

export default function Calendar({
  events,
  initialDate = new Date(),
  initialView = 'week',
  workHours = DEFAULT_WORK_HOURS,
  onViewChange,
  onDateChange,
  onEventClick,
  onSlotCreate,
  onEventUpdate,
  onEventDelete,
  onEventDuplicate,
  showConflicts = true,
  allowOverlap = true,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<CalendarView>(initialView);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; event: CalendarEvent } | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [resizingEvent, setResizingEvent] = useState<{ event: CalendarEvent; direction: 'top' | 'bottom' } | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(new Set());
  const dragStartY = useRef<number>(0);
  const resizeStartY = useRef<number>(0);
  const resizeOriginalHeight = useRef<number>(0);

  const hours = useMemo(() => {
    const length = workHours.end - workHours.start;
    return Array.from({ length: length + 1 }, (_, index) => workHours.start + index);
  }, [workHours.end, workHours.start]);

  const weekDays = useMemo(() => {
    if (view === 'day') return [currentDate];
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, [currentDate, view]);

  const monthDays = useMemo(() => {
    if (view !== 'month') return [];
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const firstDayOfWeek = startOfWeek(start);
    const days = [];
    let current = firstDayOfWeek;

    while (current <= end || days.length % 7 !== 0) {
      days.push(new Date(current));
      current = addDays(current, 1);
    }

    return days;
  }, [currentDate, view]);

  const filteredEvents = useMemo(() => {
    if (selectedCategories.size === 0) return events;
    return events.filter(event => event.category && selectedCategories.has(event.category));
  }, [events, selectedCategories]);

  const displayedEvents = useMemo(() => {
    if (view === 'month') {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = monthDays[monthDays.length - 1];
      return filteredEvents.filter((event) =>
        event.start <= addDays(end, 1) && event.start >= start
      );
    }

    if (view === 'day') {
      return filteredEvents.filter((event) => isSameDay(event.start, currentDate));
    }

    const start = startOfWeek(currentDate);
    const end = addDays(start, 7);
    return filteredEvents.filter((event) => event.start >= start && event.start < end);
  }, [currentDate, filteredEvents, view, monthDays]);

  const eventConflicts = useMemo(() => {
    if (!showConflicts) return new Set<string>();
    const conflicts = new Set<string>();

    for (let i = 0; i < displayedEvents.length; i++) {
      for (let j = i + 1; j < displayedEvents.length; j++) {
        if (eventsOverlap(displayedEvents[i], displayedEvents[j]) &&
            isSameDay(displayedEvents[i].start, displayedEvents[j].start)) {
          conflicts.add(displayedEvents[i].id);
          conflicts.add(displayedEvents[j].id);
        }
      }
    }

    return conflicts;
  }, [displayedEvents, showConflicts]);

  const goToPrevious = () => {
    let next: Date;
    if (view === 'month') {
      next = addMonths(currentDate, -1);
    } else if (view === 'week') {
      next = addDays(currentDate, -7);
    } else {
      next = addDays(currentDate, -1);
    }
    setCurrentDate(next);
    onDateChange?.(next);
  };

  const goToNext = () => {
    let next: Date;
    if (view === 'month') {
      next = addMonths(currentDate, 1);
    } else if (view === 'week') {
      next = addDays(currentDate, 7);
    } else {
      next = addDays(currentDate, 1);
    }
    setCurrentDate(next);
    onDateChange?.(next);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateChange?.(today);
  };

  const changeView = (next: CalendarView) => {
    setView(next);
    onViewChange?.(next);
  };

  const handleSlotClick = (day: Date, hour: number) => {
    if (!onSlotCreate) return;
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + 1, 0, 0, 0);
    onSlotCreate(start, end);
  };

  const handleContextMenu = (e: React.MouseEvent, event: CalendarEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, event });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    closeContextMenu();
  };

  const handleDeleteEvent = (eventId: string) => {
    onEventDelete?.(eventId);
    closeContextMenu();
  };

  const handleDuplicateEvent = (event: CalendarEvent) => {
    onEventDuplicate?.(event);
    closeContextMenu();
  };

  const handleSaveEdit = () => {
    if (!editingEvent || !onEventUpdate) return;

    const updates: Partial<CalendarEvent> = {
      title: editingEvent.title,
      start: editingEvent.start,
      end: editingEvent.end,
      location: editingEvent.location,
      description: editingEvent.description,
      category: editingEvent.category,
    };

    onEventUpdate(editingEvent.id, updates);
    setEditingEvent(null);
  };

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
    dragStartY.current = e.clientY;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: Date, hour: number) => {
    e.preventDefault();
    if (!draggedEvent || !onEventUpdate) return;

    const duration = minutesBetween(draggedEvent.start, draggedEvent.end);
    const newStart = new Date(day);
    newStart.setHours(hour, 0, 0, 0);
    const newEnd = new Date(newStart);
    newEnd.setMinutes(newEnd.getMinutes() + duration);

    if (!allowOverlap) {
      const wouldConflict = events.some(e =>
        e.id !== draggedEvent.id &&
        eventsOverlap({ ...draggedEvent, start: newStart, end: newEnd }, e)
      );
      if (wouldConflict) return;
    }

    onEventUpdate(draggedEvent.id, { start: newStart, end: newEnd });
    setDraggedEvent(null);
  };

  const handleResizeStart = (e: React.MouseEvent, event: CalendarEvent, direction: 'top' | 'bottom') => {
    e.stopPropagation();
    setResizingEvent({ event, direction });
    resizeStartY.current = e.clientY;
    resizeOriginalHeight.current = minutesBetween(event.start, event.end);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingEvent || !onEventUpdate) return;

    const deltaY = e.clientY - resizeStartY.current;
    const deltaMinutes = Math.round(deltaY / 64 * 60); // 64px per hour
    const minDuration = 30;

    let newStart = new Date(resizingEvent.event.start);
    let newEnd = new Date(resizingEvent.event.end);

    if (resizingEvent.direction === 'bottom') {
      const newDuration = Math.max(minDuration, resizeOriginalHeight.current + deltaMinutes);
      newEnd = new Date(newStart);
      newEnd.setMinutes(newEnd.getMinutes() + newDuration);
    } else {
      const newDuration = Math.max(minDuration, resizeOriginalHeight.current - deltaMinutes);
      newStart = new Date(newEnd);
      newStart.setMinutes(newStart.getMinutes() - newDuration);
    }

    onEventUpdate(resizingEvent.event.id, { start: newStart, end: newEnd });
  }, [resizingEvent, onEventUpdate]);

  const handleResizeEnd = useCallback(() => {
    setResizingEvent(null);
  }, []);

  useEffect(() => {
    if (resizingEvent) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingEvent, handleResizeMove, handleResizeEnd]);

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const renderEvent = (event: CalendarEvent) => {
    const dayIndex = weekDays.findIndex((day) => isSameDay(day, event.start));
    if (dayIndex === -1) return null;

    const minutesFromStart = (event.start.getHours() - workHours.start) * 60 + event.start.getMinutes();
    const top = Math.max(0, minutesFromStart);
    const duration = Math.max(30, minutesBetween(event.start, event.end));
    const height = (duration / 60) * 64;

    const background = event.color ?? (event.category ? CATEGORY_COLORS[event.category] : 'bg-blue-500');
    const hasConflict = eventConflicts.has(event.id);

    return (
      <div
        key={event.id}
        draggable
        onDragStart={(e) => handleDragStart(e, event)}
        onClick={() => onEventClick?.(event)}
        onContextMenu={(e) => handleContextMenu(e, event)}
        className={`absolute inset-x-2 cursor-move rounded-lg px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:opacity-90 ${background} ${hasConflict ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
        style={{ top: `${top}px`, height: `${height}px` }}
        aria-label={`${event.title} ${hourFormatter.format(event.start)}-${hourFormatter.format(event.end)}`}
      >
        {hasConflict && (
          <AlertCircle className="absolute -right-1 -top-1 h-4 w-4 text-red-500 bg-white rounded-full" />
        )}

        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 cursor-ns-resize opacity-0 hover:opacity-100 transition"
          onMouseDown={(e) => handleResizeStart(e, event, 'top')}
        >
          <div className="w-full h-0.5 bg-white/80 rounded-full" />
        </div>

        <p className="text-sm font-semibold truncate">{event.title}</p>
        <p className="text-[11px] text-white/80">
          {hourFormatter.format(event.start)} – {hourFormatter.format(event.end)}
        </p>
        {event.location && <p className="text-[11px] text-white/70 truncate">{event.location}</p>}
        {event.meta}

        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 cursor-ns-resize opacity-0 hover:opacity-100 transition"
          onMouseDown={(e) => handleResizeStart(e, event, 'bottom')}
        >
          <div className="w-full h-0.5 bg-white/80 rounded-full" />
        </div>
      </div>
    );
  };

  const renderMonthEvent = (event: CalendarEvent) => {
    const background = event.color ?? (event.category ? CATEGORY_COLORS[event.category] : 'bg-blue-500');
    return (
      <div
        key={event.id}
        onClick={() => onEventClick?.(event)}
        onContextMenu={(e) => handleContextMenu(e, event)}
        className={`text-[10px] px-1 py-0.5 mb-0.5 rounded truncate text-white cursor-pointer ${background}`}
      >
        {hourFormatter.format(event.start)} {event.title}
      </div>
    );
  };

  const getDateRangeText = () => {
    if (view === 'month') {
      return formatDate(currentDate, { month: 'long', year: 'numeric' });
    }
    if (view === 'week') {
      return `${formatDate(startOfWeek(currentDate), { month: 'long', day: 'numeric' })} – ${formatDate(addDays(startOfWeek(currentDate), 6), { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }
    return formatDate(currentDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrevious}
              className="rounded-full border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Poprzedni"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Dzisiaj
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="rounded-full border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Następny"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {getDateRangeText()}
            </p>
            <div className="flex justify-end gap-1">
              <button
                type="button"
                onClick={() => changeView('day')}
                className={`rounded-md px-3 py-1 text-sm font-medium ${view === 'day' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}
              >
                Dzień
              </button>
              <button
                type="button"
                onClick={() => changeView('week')}
                className={`rounded-md px-3 py-1 text-sm font-medium ${view === 'week' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}
              >
                Tydzień
              </button>
              <button
                type="button"
                onClick={() => changeView('month')}
                className={`rounded-md px-3 py-1 text-sm font-medium ${view === 'month' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}
              >
                Miesiąc
              </button>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map(category => {
            const isActive = selectedCategories.size === 0 || selectedCategories.has(category);
            const color = CATEGORY_COLORS[category];
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  isActive
                    ? `${color} text-white`
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            );
          })}
        </div>
      </header>

      {view === 'month' ? (
        <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
          {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'].map(day => (
            <div key={day} className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
              {day}
            </div>
          ))}
          {monthDays.map(day => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = isSameDay(day, new Date());
            const dayEvents = displayedEvents.filter(e => isSameDay(e.start, day));

            return (
              <div
                key={day.toISOString()}
                className={`bg-white dark:bg-slate-900 p-2 min-h-[100px] ${!isCurrentMonth ? 'opacity-40' : ''}`}
                onDoubleClick={() => {
                  setCurrentDate(day);
                  changeView('day');
                }}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700 dark:text-slate-200'}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map(renderMonthEvent)}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      +{dayEvents.length - 3} więcej
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative">
          <div className="grid" style={{ gridTemplateColumns: `80px repeat(${weekDays.length}, minmax(0, 1fr))` }}>
            <div className="border-b border-slate-200 dark:border-slate-700" />
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div key={day.toISOString()} className="border-b border-slate-200 px-4 pb-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  <div>{formatDate(day, { weekday: 'short' })}</div>
                  <div className={`text-lg ${isToday ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center' : 'text-slate-900 dark:text-slate-100'}`}>
                    {formatDate(day, { day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `80px repeat(${weekDays.length}, minmax(0, 1fr))` }}>
            <div className="relative">
              {hours.map((hour) => (
                <div key={hour} className="relative h-16 border-b border-slate-100 pr-2 text-right text-xs text-slate-400 dark:border-slate-800">
                  <span className="absolute -bottom-2 right-0 translate-y-1/2">
                    {hourFormatter.format(new Date(2020, 0, 1, hour, 0))}
                  </span>
                </div>
              ))}
            </div>
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="relative border-l border-slate-100 dark:border-slate-800">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    onDoubleClick={() => handleSlotClick(day, hour)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, hour)}
                    className="h-16 w-full border-b border-slate-100 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-blue-500/10 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Dodaj wydarzenie ${formatDate(day, { weekday: 'long' })} ${hour}:00`}
                  />
                ))}
                <div className="absolute inset-x-0 top-0 pointer-events-none">
                  <div className="pointer-events-auto">
                    {displayedEvents.filter((event) => isSameDay(event.start, day)).map(renderEvent)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 min-w-[160px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            type="button"
            onClick={() => handleEditEvent(contextMenu.event)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edytuj
          </button>
          <button
            type="button"
            onClick={() => handleDuplicateEvent(contextMenu.event)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Duplikuj
          </button>
          <button
            type="button"
            onClick={() => handleDeleteEvent(contextMenu.event.id)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Usuń
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Edytuj wydarzenie</h3>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <TextField
                label="Tytuł"
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Początek
                  </label>
                  <input
                    type="datetime-local"
                    value={editingEvent.start.toISOString().slice(0, 16)}
                    onChange={(e) => setEditingEvent({ ...editingEvent, start: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Koniec
                  </label>
                  <input
                    type="datetime-local"
                    value={editingEvent.end.toISOString().slice(0, 16)}
                    onChange={(e) => setEditingEvent({ ...editingEvent, end: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <TextField
                label="Lokalizacja"
                value={editingEvent.location || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Kategoria
                </label>
                <select
                  value={editingEvent.category || 'other'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as EventCategory })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-800 text-sm"
                >
                  {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map(cat => (
                    <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Opis
                </label>
                <textarea
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-800 text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                <Check className="h-4 w-4" />
                Zapisz
              </button>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium text-sm text-slate-700 dark:text-slate-200"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
