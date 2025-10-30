# 📅 Calendar Component - Dokumentacja

Zaawansowany komponent kalendarza w stylu Microsoft Outlook/Google Calendar z pełną obsługą interakcji, edycji wydarzeń i zarządzania czasem.

## 📍 Lokalizacja

- **Komponent główny**: `frontend/src/components/ui/calendar.tsx`
- **Demo/Przykład**: `demo/app/brandbook/page.tsx` (sekcja "Kalendarz / Agenda dnia")
- **Live Preview**: `http://localhost:3002/brandbook` (podczas uruchomienia demo)

---

## ✨ Kluczowe Funkcjonalności

### 🎯 Podstawowe
- ✅ **3 tryby widoku**: Dzień / Tydzień / Miesiąc
- ✅ **Tworzenie wydarzeń**: Podwójne kliknięcie na slot czasowy
- ✅ **Kliknięcie w wydarzenie**: Callback z pełnymi danymi
- ✅ **Nawigacja**: Poprzedni/Następny okres, przycisk "Dzisiaj"
- ✅ **Konfigurowalne godziny pracy**: Domyślnie 8:00-20:00

### 🚀 Zaawansowane
- ✅ **Drag & Drop**: Przeciąganie wydarzeń między slotami
- ✅ **Resize**: Zmiana czasu trwania przez przeciągnięcie krawędzi
- ✅ **Edit Modal**: Pełny formularz edycji (tytuł, czas, lokalizacja, kategoria, opis)
- ✅ **Context Menu**: Prawy przycisk myszy → Edytuj / Duplikuj / Usuń
- ✅ **Wykrywanie konfliktów**: Czerwone oznaczenie nakładających się wydarzeń
- ✅ **System kategorii**: 5 predefiniowanych kategorii z kolorami
- ✅ **Filtry kategorii**: Interaktywne przyciski filtrowania
- ✅ **Dark mode**: Automatyczne dopasowanie do motywu
- ✅ **Lokalizacja**: Polski interfejs i formatowanie dat

---

## 📖 API Reference

### Props

```typescript
interface CalendarProps {
  // Dane
  events: CalendarEvent[];

  // Konfiguracja początkowa
  initialDate?: Date;                    // Domyślnie: new Date()
  initialView?: CalendarView;            // 'day' | 'week' | 'month', domyślnie: 'week'
  workHours?: { start: number; end: number }; // Domyślnie: { start: 8, end: 20 }

  // Opcje zachowania
  showConflicts?: boolean;               // Domyślnie: true
  allowOverlap?: boolean;                // Domyślnie: true

  // Callbacki - podstawowe
  onViewChange?: (view: CalendarView) => void;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotCreate?: (start: Date, end: Date) => void;

  // Callbacki - zaawansowane
  onEventUpdate?: (eventId: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete?: (eventId: string) => void;
  onEventDuplicate?: (event: CalendarEvent) => void;
}
```

### Types

```typescript
// Tryby widoku
type CalendarView = 'month' | 'week' | 'day';

// Kategorie wydarzeń
type EventCategory = 'meeting' | 'workshop' | 'demo' | 'personal' | 'other';

// Struktura wydarzenia
interface CalendarEvent {
  id: string;                    // Unikalny identyfikator
  title: string;                 // Tytuł wydarzenia
  start: Date;                   // Data i godzina rozpoczęcia
  end: Date;                     // Data i godzina zakończenia
  location?: string;             // Opcjonalna lokalizacja
  description?: string;          // Opcjonalny opis
  color?: string;                // Opcjonalny custom kolor (Tailwind class)
  category?: EventCategory;      // Opcjonalna kategoria
  meta?: ReactNode;              // Opcjonalny dodatkowy content
}
```

---

## 🎨 System Kategorii

Kalendarz wspiera 5 predefiniowanych kategorii z przypisanymi kolorami:

| Kategoria | Kolor | Tailwind Class | Przykłady użycia |
|-----------|-------|----------------|-------------------|
| **meeting** | Niebieski | `bg-blue-500` | Spotkania, planningi, stand-upy |
| **workshop** | Fioletowy | `bg-violet-500` | Warsztaty, szkolenia, webinary |
| **demo** | Bursztynowy | `bg-amber-500` | Prezentacje, dema produktów |
| **personal** | Zielony | `bg-emerald-500` | Prywatne spotkania, 1:1 |
| **other** | Szary | `bg-gray-500` | Inne wydarzenia |

### Kolory mogą być nadpisane

```typescript
const event: CalendarEvent = {
  id: '1',
  title: 'Specjalne wydarzenie',
  start: new Date(),
  end: new Date(),
  color: 'bg-pink-500', // Nadpisuje kolor kategorii
  category: 'meeting'
};
```

---

## 💡 Przykłady Użycia

### Podstawowa implementacja

```tsx
import Calendar, { type CalendarEvent } from '@frontend/components/ui/calendar';
import { useState } from 'react';

export default function MyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Spotkanie zespołu',
      start: new Date(2024, 10, 24, 9, 0),
      end: new Date(2024, 10, 24, 10, 0),
      location: 'Sala konferencyjna',
      category: 'meeting'
    }
  ]);

  return (
    <Calendar
      events={events}
      onSlotCreate={(start, end) => {
        const newEvent: CalendarEvent = {
          id: `event-${Date.now()}`,
          title: 'Nowe wydarzenie',
          start,
          end,
          category: 'other'
        };
        setEvents([...events, newEvent]);
      }}
    />
  );
}
```

### Pełna implementacja z wszystkimi funkcjami

```tsx
import Calendar, { type CalendarEvent } from '@frontend/components/ui/calendar';
import { useState, useCallback } from 'react';

export default function AdvancedCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Tworzenie nowego wydarzenia (double-click na slot)
  const handleSlotCreate = useCallback((start: Date, end: Date) => {
    const newEvent: CalendarEvent = {
      id: `draft-${Date.now()}`,
      title: 'Nowe spotkanie',
      start,
      end,
      category: 'meeting',
      location: 'Do ustalenia',
      description: 'Kliknij prawym przyciskiem aby edytować'
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  // Aktualizacja wydarzenia (drag, resize, edit modal)
  const handleEventUpdate = useCallback((eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
  }, []);

  // Usuwanie wydarzenia (context menu → usuń)
  const handleEventDelete = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  }, []);

  // Duplikowanie wydarzenia (context menu → duplikuj)
  const handleEventDuplicate = useCallback((event: CalendarEvent) => {
    const duplicated: CalendarEvent = {
      ...event,
      id: `duplicate-${Date.now()}`,
      title: `${event.title} (kopia)`,
      start: new Date(event.start.getTime() + 24 * 60 * 60 * 1000), // +1 dzień
      end: new Date(event.end.getTime() + 24 * 60 * 60 * 1000),
    };
    setEvents(prev => [...prev, duplicated]);
  }, []);

  // Kliknięcie w wydarzenie
  const handleEventClick = useCallback((event: CalendarEvent) => {
    console.log('Kliknięto wydarzenie:', event);
    // Można otworzyć własny modal, toast, itp.
  }, []);

  return (
    <Calendar
      events={events}
      initialView="week"
      workHours={{ start: 8, end: 20 }}
      showConflicts={true}
      allowOverlap={true}

      onSlotCreate={handleSlotCreate}
      onEventClick={handleEventClick}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      onEventDuplicate={handleEventDuplicate}

      onViewChange={(view) => console.log('Zmieniono widok na:', view)}
      onDateChange={(date) => console.log('Zmieniono datę na:', date)}
    />
  );
}
```

### Blokowanie konfliktów

```tsx
<Calendar
  events={events}
  showConflicts={true}    // Pokazuj wizualne ostrzeżenia
  allowOverlap={false}    // Blokuj drag & drop na zajęte sloty
  onEventUpdate={handleEventUpdate}
/>
```

### Custom godziny pracy

```tsx
<Calendar
  events={events}
  workHours={{ start: 6, end: 22 }} // 6:00 - 22:00
/>
```

---

## 🎯 Interakcje Użytkownika

### 1. **Tworzenie Nowego Wydarzenia**
- **Akcja**: Podwójne kliknięcie na wolny slot czasowy
- **Callback**: `onSlotCreate(start, end)`
- **Użycie**: Stwórz nowy obiekt `CalendarEvent` i dodaj do stanu

### 2. **Drag & Drop**
- **Akcja**: Przeciągnij wydarzenie na inny slot
- **Callback**: `onEventUpdate(eventId, { start, end })`
- **Zachowanie**: Zachowuje czas trwania, zmienia tylko start time
- **Konflikt**: Jeśli `allowOverlap=false`, blokuje drag na zajęty slot

### 3. **Resize (Zmiana czasu trwania)**
- **Akcja**: Najedź na górę/dół wydarzenia → przeciągnij
- **Callback**: `onEventUpdate(eventId, { start, end })`
- **Minimum**: 30 minut
- **Uchwyty**: Widoczne przy hover (opacity 0 → 100)

### 4. **Context Menu (Prawy przycisk)**
- **Akcja**: Prawy przycisk myszy na wydarzeniu
- **Opcje**:
  - **Edytuj** → Otwiera modal edycji
  - **Duplikuj** → `onEventDuplicate(event)`
  - **Usuń** → `onEventDelete(eventId)`

### 5. **Edit Modal**
- **Akcja**: Context menu → Edytuj lub custom trigger
- **Pola**:
  - Tytuł (TextField)
  - Początek (datetime-local input)
  - Koniec (datetime-local input)
  - Lokalizacja (TextField)
  - Kategoria (Select dropdown)
  - Opis (Textarea)
- **Przyciski**: Zapisz / Anuluj

### 6. **Wykrywanie Konfliktów**
- **Wizualizacja**:
  - Czerwona ramka (`ring-2 ring-red-500`)
  - Ikona ostrzeżenia (AlertCircle, góra-prawo)
- **Logika**: Sprawdza czy `event1.start < event2.end && event1.end > event2.start`
- **Wyłączenie**: `showConflicts={false}`

### 7. **Filtry Kategorii**
- **Akcja**: Kliknięcie w przycisk kategorii (nad kalendarzem)
- **Zachowanie**:
  - Pierwsze kliknięcie: Pokazuje tylko tę kategorię
  - Kolejne kliknięcie: Dodaje/usuwa z filtra
  - Brak aktywnych filtrów: Pokazuje wszystkie wydarzenia

### 8. **Widok Miesiąca**
- **Akcja**: Przycisk "Miesiąc"
- **Interakcja**: Podwójne kliknięcie na dzień → przejście do widoku dnia
- **Wyświetlanie**: Do 3 wydarzeń + licznik "+X więcej"

---

## 🎨 Stylowanie i Dostosowanie

### Dark Mode
Kalendarz automatycznie dostosowuje się do motywu dzięki Tailwind CSS:
```css
/* Jasny motyw */
bg-white, text-slate-900, border-slate-200

/* Ciemny motyw */
dark:bg-slate-900, dark:text-slate-100, dark:border-slate-700
```

### Custom Kolory Wydarzeń
```typescript
const event: CalendarEvent = {
  id: '1',
  title: 'VIP Meeting',
  start: new Date(),
  end: new Date(),
  color: 'bg-rose-500', // Dowolny Tailwind color
  category: 'meeting'
};
```

### Custom Meta Content
```tsx
const event: CalendarEvent = {
  id: '1',
  title: 'Ważne spotkanie',
  start: new Date(),
  end: new Date(),
  meta: (
    <div className="flex items-center gap-1 text-[10px] mt-1">
      <UserIcon className="h-3 w-3" />
      <span>3 uczestników</span>
    </div>
  )
};
```

---

## 🧪 Scenariusze Testowe

### Test 1: Podstawowe tworzenie wydarzenia
1. Otwórz widok tygodnia
2. Kliknij 2x na slot (np. Wtorek 10:00)
3. Sprawdź czy callback `onSlotCreate` został wywołany
4. Dodaj wydarzenie do stanu
5. Sprawdź czy wydarzenie wyświetla się na kalendarzu

### Test 2: Drag & Drop
1. Stwórz wydarzenie na Poniedziałek 9:00
2. Przeciągnij na Środę 14:00
3. Sprawdź czy callback `onEventUpdate` zawiera nowy start/end
4. Sprawdź czy czas trwania się nie zmienił

### Test 3: Resize
1. Stwórz wydarzenie 1-godzinne
2. Najedź na dolną krawędź
3. Przeciągnij w dół (np. o 30 minut)
4. Sprawdź czy `onEventUpdate` otrzymał nowy `end`
5. Sprawdź czy minimalny czas to 30 minut

### Test 4: Context Menu
1. Kliknij prawym przyciskiem na wydarzeniu
2. Sprawdź czy pokazuje się menu z 3 opcjami
3. Kliknij "Duplikuj"
4. Sprawdź czy `onEventDuplicate` został wywołany
5. Sprawdź czy nowe wydarzenie ma +1 dzień

### Test 5: Wykrywanie konfliktów
1. Stwórz wydarzenie 9:00-10:00
2. Stwórz wydarzenie 9:30-10:30
3. Sprawdź czy oba mają czerwoną ramkę i ikonę ostrzeżenia
4. Ustaw `allowOverlap={false}`
5. Spróbuj przeciągnąć 3. wydarzenie na ten sam slot
6. Sprawdź czy drag jest zablokowany

### Test 6: Filtry kategorii
1. Dodaj wydarzenia z różnymi kategoriami
2. Kliknij filtr "Warsztat"
3. Sprawdź czy pokazują się tylko warsztaty
4. Kliknij filtr "Demo"
5. Sprawdź czy pokazują się warsztaty + dema
6. Kliknij ponownie "Warsztat"
7. Sprawdź czy zostały tylko dema

### Test 7: Widok miesiąca
1. Przełącz na widok "Miesiąc"
2. Sprawdź czy wszystkie dni są widoczne
3. Kliknij 2x na dzień z przyszłego miesiąca
4. Sprawdź czy przełącza na widok dnia tego dnia

---

## 🔧 Implementacja Wewnętrzna

### Kluczowe Hooki
```typescript
// Stan
const [currentDate, setCurrentDate] = useState(initialDate);
const [view, setView] = useState<CalendarView>(initialView);
const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
const [resizingEvent, setResizingEvent] = useState<{...} | null>(null);
const [contextMenu, setContextMenu] = useState<{...} | null>(null);
const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(new Set());

// Memorized computations
const hours = useMemo(() => [...], [workHours]);
const weekDays = useMemo(() => [...], [currentDate, view]);
const monthDays = useMemo(() => [...], [currentDate, view]);
const displayedEvents = useMemo(() => [...], [currentDate, filteredEvents, view]);
const eventConflicts = useMemo(() => new Set<string>(), [displayedEvents]);
```

### Event Handling Flow
```
User Action → React Event → Handler → State Update → Callback
   ↓             ↓            ↓          ↓             ↓
Double-click → onDoubleClick → handleSlotClick → onSlotCreate
Drag start   → onDragStart   → handleDragStart → setDraggedEvent
Drop         → onDrop         → handleDrop      → onEventUpdate
Right-click  → onContextMenu  → handleContextMenu → setContextMenu
```

### Pozycjonowanie Wydarzeń
```typescript
// Pozycja Y = minuty od początku godzin pracy
const minutesFromStart = (event.start.getHours() - workHours.start) * 60 + event.start.getMinutes();
const top = Math.max(0, minutesFromStart);

// Wysokość = czas trwania * 64px/godzinę
const duration = minutesBetween(event.start, event.end);
const height = (duration / 60) * 64;
```

---

## 🚀 Przyszłe Rozszerzenia

### Planowane Funkcjonalności (Faza 3)
- [ ] Wydarzenia cykliczne (recurring events)
  - Daily / Weekly / Monthly / Custom patterns
  - Edycja pojedynczego wystąpienia vs całej serii
  - Wyjątki (skip specific dates)

- [ ] Wydarzenia wielodniowe
  - Span across multiple days
  - Wyświetlanie jako "bar" w widoku tygodnia
  - Lepszy widok w miesiącu

- [ ] Range Picker
  - Wybór zakresu dat w formularzach
  - Integracja z FormFields
  - Walidacja min/max

### Planowane Funkcjonalności (Faza 4)
- [ ] Uczestnicy i zasoby
  - Dodawanie uczestników do wydarzeń
  - Sprawdzanie dostępności
  - Rezerwacja zasobów (sala, projektor)

- [ ] Przypomnienia
  - Toast notifications przed wydarzeniem
  - Email reminders (backend integration)
  - Custom reminder times

- [ ] Export/Import
  - Export to ICS (iCalendar format)
  - Import from ICS
  - JSON export

- [ ] Time zones
  - Obsługa różnych stref czasowych
  - Automatyczna konwersja
  - Wyświetlanie local vs UTC

---

## 📝 Changelog

### v1.0.0 (2024-10-24)
**✨ Początkowa implementacja z pełnym zestawem funkcji:**
- ✅ 3 tryby widoku (Day/Week/Month)
- ✅ Drag & Drop
- ✅ Resize handles
- ✅ Edit modal
- ✅ Context menu
- ✅ Conflict detection
- ✅ Category system & filters
- ✅ Dark mode support
- ✅ Polish localization

---

## 🤝 Kontryb ucja

Aby dodać nowe funkcje do kalendarza:

1. **Fork i branch**: `git checkout -b feature/calendar-xyz`
2. **Implementacja**: Dodaj funkcjonalność w `calendar.tsx`
3. **Typy**: Zaktualizuj interfejsy `CalendarProps` i `CalendarEvent`
4. **Testy**: Dodaj scenariusze testowe w brandbooku
5. **Dokumentacja**: Zaktualizuj ten plik
6. **PR**: Otwórz Pull Request z opisem zmian

---

## 📚 Powiązane Komponenty

- **DatePicker** (`datePickers.tsx`) - Input date picker
- **TimePicker** (`datePickers.tsx`) - Input time picker
- **DateTimePicker** (`datePickers.tsx`) - Combined date & time input
- **Button** (`button.tsx`) - Używany w modalach i nawigacji
- **TextField** (`formFields.tsx`) - Używany w edit modalu
- **Toast** (`toast.tsx`) - Notyfikacje o akcjach

---

## 🐛 Znane Ograniczenia

1. **Resize w widoku miesiąca**: Niedostępny (zbyt mała skala)
2. **Drag between months**: Wymaga ręcznego przełączenia miesiąca
3. **Mobile touch**: Może wymagać dodatkowej obsługi touch events
4. **Very long events**: Wydarzenia > 12h mogą wyglądać nieproporcjonalnie

---

## 💬 FAQ

**Q: Jak zmienić domyślne godziny pracy?**
A: Użyj prop `workHours={{ start: 6, end: 22 }}`

**Q: Jak wyłączyć conflict detection?**
A: Ustaw `showConflicts={false}`

**Q: Jak zablokować nakładanie się wydarzeń?**
A: Ustaw `allowOverlap={false}` + obsłuż validację w `onEventUpdate`

**Q: Czy można dodać własne kategorie?**
A: Tak, ale wymaga modyfikacji typów i `CATEGORY_COLORS` w `calendar.tsx`

**Q: Jak zintegrować z backendem?**
A: Użyj `onEventUpdate/Delete/Duplicate` do wysyłania requestów API

**Q: Czy wspiera SSR?**
A: Tak, oznaczony jako `'use client'` więc działa z Next.js App Router

---

*Dokumentacja utworzona: 2024-10-24*
*Wersja komponentu: 1.0.0*
*Ostatnia aktualizacja: 2024-10-24*
