'use client';

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ExternalLink, Users, BarChart3, DollarSign, LayoutDashboard, Layers, ShieldCheck, LifeBuoy, FileText, Zap, Copy, Trash2, Download, PenLine, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Modal from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import Hero from '@/components/general/Hero';
import Navigation from '@/components/general/Navigation';
import Stats from '@/components/general/Stats';
import Features from '@/components/general/Features';
import TestimonialSlider from '@/components/general/TestimonialSlider';
import CourseCard from '@/components/general/CourseCard';
import CTA from '@/components/general/CTA';
import ComponentShowcase from '@/components/brandbook/ComponentShowcase';
import DashboardWidgets from '@/components/admin/DashboardWidgets';
import DataTable, { type AdminTableColumn } from '@/components/admin/DataTable';
import AdminForm from '@/components/admin/AdminForm';
import FinanceCharts from '@/components/FinanceCharts';
import Footer from '@frontend/components/general/Footer';
import {
  TextField,
  TextareaField,
  PasswordField,
  NumberField,
  ColorPickerField,
} from '@frontend/components/ui/formFields';
import {
  CheckboxField,
  RadioGroupField,
  SelectField,
  SwitchField,
  SearchField,
} from '@frontend/components/ui/choiceFields';
import TextLink from '@frontend/components/ui/textLink';
import { InlineMessage } from '@frontend/components/ui/inlineMessage';
import { AlertBanner } from '@frontend/components/ui/alertBanner';
import Pagination from '@frontend/components/ui/pagination';
import Breadcrumbs from '@frontend/components/ui/breadcrumbs';
import { Chip, FilterPill } from '@frontend/components/ui/chip';
import { LoadMoreButton } from '@frontend/components/ui/loadMoreButton';
import Slider, { RangeSlider } from '@frontend/components/ui/slider';
import Stepper from '@frontend/components/ui/stepper';
import Calendar, { type CalendarEvent } from '@frontend/components/ui/calendar';
import Autocomplete, { type AutocompleteOption } from '@frontend/components/ui/autocomplete';
import { DatePicker, DateTimePicker, TimePicker } from '@frontend/components/ui/datePickers';
import MegaMenu, { type MegaMenuColumn } from '@frontend/components/navigation/MegaMenu';
import ContextMenu, { type ContextMenuItem } from '@frontend/components/ui/contextMenu';
import SplitButton, { type SplitButtonOption } from '@frontend/components/ui/splitButton';
import FileUploader from '@frontend/components/ui/fileUploader';
import Tooltip from '@frontend/components/ui/tooltip';
import Popover from '@frontend/components/ui/popover';
import Accordion from '@frontend/components/ui/accordion';
import Tabs from '@frontend/components/ui/tabs';
import Toolbar, { ToolbarGroup, ToolbarSeparator } from '@frontend/components/ui/toolbar';
import List from '@frontend/components/ui/list';
import LayoutGrid, { LayoutSection } from '@frontend/components/ui/layoutGrid';
import StatCard from '@frontend/components/ui/statCard';
import SectionHeader from '@frontend/components/ui/sectionHeader';
import { Badge, StatusTag } from '@frontend/components/ui/badge';
import { ProgressBar, ProgressCircle } from '@frontend/components/ui/progress';
import Avatar from '@frontend/components/ui/avatar';
import InputMaskField from '@frontend/components/ui/inputMaskField';
import { ThemeToggle } from '@frontend/components/ui/themeToggle';

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin';
  status: 'Active' | 'Invited' | 'Suspended';
};

type AdminFormFieldConfig = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';
  options?: { label: string; value: string }[];
  required?: boolean;
  placeholder?: string;
  helperText?: string;
};

type FieldShowcaseState = {
  name: string;
  email: string;
  password: string;
  price: string;
  description: string;
  role: string;
  marketing: boolean;
  notifications: boolean;
  plan: string;
  search: string;
  phone: string;
  pesel: string;
  brandColor: string;
};

const palette = [
  { name: 'Primary / Indigo 600', value: '#2563EB', usage: 'CTA, aktywne linki, wyróżnienia' },
  { name: 'Secondary / Slate 700', value: '#334155', usage: 'Teksty nagłówków, ikony' },
  { name: 'Accent / Sky 100', value: '#E0F2FE', usage: 'Tła kart onboardingowych' },
  { name: 'Success / Emerald 500', value: '#10B981', usage: 'Statusy pozytywne, potwierdzenia' },
  { name: 'Warning / Amber 500', value: '#F59E0B', usage: 'Alerty ostrzegawcze, badge wstrzymane' },
  { name: 'Danger / Rose 500', value: '#F43F5E', usage: 'Błędy krytyczne, akcje usuwania' },
  { name: 'Neutral / Gray 100', value: '#F3F4F6', usage: 'Tła sekcji, dzielące bloki' },
];

const typographySamples = [
  { label: 'Nagłówek H1', className: 'text-4xl font-bold', sample: 'EduPlatform – Ucz się bez ograniczeń' },
  { label: 'Nagłówek H2', className: 'text-3xl font-semibold', sample: 'Panel administracyjny' },
  { label: 'Podtytuł', className: 'text-xl text-muted-foreground', sample: 'Nowoczesna platforma do zarządzania edukacją' },
  { label: 'Tekst główny', className: 'text-base text-foreground', sample: 'Dostarczaj kursy, monitoruj postępy i angażuj studentów w jednym miejscu.' },
  { label: 'Caption', className: 'text-xs uppercase tracking-wide text-muted-foreground', sample: 'Komponent UI' },
];

const marketingStats = [
  { number: '50K+', label: 'Aktywnych studentów' },
  { number: '200+', label: 'Kursów premium' },
  { number: '98%', label: 'Satysfakcji' },
  { number: '24/7', label: 'Wsparcia' },
];

const marketingFeatures = [
  { title: 'Eksperci branżowi', description: 'Zajęcia prowadzone przez liderów rynku w swoich dziedzinach.', icon: '🎓' },
  { title: 'Elastyczne ścieżki', description: 'Łącz moduły kursów, aby tworzyć własne ścieżki rozwoju.', icon: '🧭' },
  { title: 'Automatyzacja raportów', description: 'Śledź postępy i wyniki dzięki gotowym dashboardom.', icon: '📊' },
  { title: 'Społeczność', description: 'Buduj społeczność i wspieraj networking studentów.', icon: '💬' },
];

const courseSuggestions: AutocompleteOption[] = [
  { label: 'React dla zespołów', value: 'react-teams', description: 'Ścieżka front-end dla zespołów produktowych.' },
  { label: 'Design Systems w praktyce', value: 'design-systems', description: 'Budowa systemów UI end-to-end.' },
  { label: 'AI w edukacji', value: 'ai-education', description: 'Automatyzacja tworzenia materiałów i tutoring.' },
  { label: 'Zarządzanie zmianą', value: 'change-management', description: 'Wsparcie zespołów w transformacji.' },
  { label: 'Warsztaty UX', value: 'ux-workshop', description: 'Badania, testy i analizy UX w praktyce.' },
];

const mentorSuggestions: AutocompleteOption[] = [
  { label: 'Anna Kowalska', value: 'anna', description: 'Specjalistka ds. onboardingu' },
  { label: 'Jakub Nowak', value: 'jakub', description: 'Ekspert front-end' },
  { label: 'Marta Lewandowska', value: 'marta', description: 'Koordynator ds. quality assurance' },
  { label: 'Igor Wójcik', value: 'igor', description: 'Data storytelling mentor' },
];

const onboardingSteps = [
  {
    title: 'Szczegóły',
    description: 'Uzupełnij podstawowe informacje o kursie.',
    optionalLabel: '3 min',
    content: (
      <div className="space-y-2 text-left">
        <p>Wprowadź nazwę programu, krótki opis oraz kategorie widoczności.</p>
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          <li>Dodaj wyróżniającą miniaturę kursu.</li>
          <li>Ustal język prowadzenia i poziom trudności.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Konfiguracja',
    description: 'Ustal harmonogram i prowadzących.',
    optionalLabel: '8 min',
    content: (
      <div className="space-y-2 text-left">
        <p>Zaplanuj strukturę modułów i przypisz mentorów do poszczególnych lekcji.</p>
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          <li>Określ zasady dostępu i progi zaliczeniowe.</li>
          <li>Włącz automatyczne powiadomienia o nowych materiałach.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Publikacja',
    description: 'Opublikuj kurs i powiadom interesariuszy.',
    optionalLabel: '2 min',
    content: (
      <div className="space-y-2 text-left">
        <p>Zweryfikuj kompletność materiałów i wyślij zaproszenia do uczestników.</p>
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          <li>Ustaw widoczność kursu (prywatny/publiczny).</li>
          <li>Dodaj baner promocyjny oraz włącz stronę sprzedażową.</li>
        </ul>
      </div>
    ),
  },
];

const reviewWorkflowSteps = [
  {
    title: 'Draft',
    description: 'Zespół produktowy złożył szkic modułu.',
    status: 'complete' as const,
    meta: 'Zakończono 12.04',
  },
  {
    title: 'Review',
    description: 'Eksperci merytoryczni oceniają zawartość.',
    status: 'current' as const,
    meta: '2 komentarze oczekują na odpowiedź',
  },
  {
    title: 'Compliance',
    description: 'Kontrola zgodności prawnej i certyfikacyjnej.',
    status: 'upcoming' as const,
    meta: 'Planowana data: 20.04',
  },
  {
    title: 'Publikacja',
    description: 'Moduł gotowy do publikacji.',
    status: 'upcoming' as const,
    meta: 'Czeka na zatwierdzenie dyrektora programu',
  },
];

const badgeVariantShowcase: Array<{
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  variant: 'solid' | 'subtle' | 'outline';
  label: string;
}> = [
  { tone: 'neutral', variant: 'subtle', label: 'Draft' },
  { tone: 'info', variant: 'solid', label: 'Nowość' },
  { tone: 'success', variant: 'solid', label: 'Aktywny' },
  { tone: 'warning', variant: 'outline', label: 'Wstrzymany' },
  { tone: 'danger', variant: 'subtle', label: 'Ryzyko' },
];

const statusTagShowcase: Array<{ status: 'default' | 'success' | 'info' | 'warning' | 'danger' | 'offline'; label: string }> = [
  { status: 'success', label: 'Opublikowany kurs' },
  { status: 'info', label: 'Planowany webinar' },
  { status: 'warning', label: 'Limit miejsc' },
  { status: 'danger', label: 'Błąd płatności' },
  { status: 'offline', label: 'Mentor offline' },
];

const avatarShowcase = [
  {
    name: 'Anna Kowalska',
    role: 'Instruktorka UX',
    status: 'online' as const,
    src: '/api/placeholder/96/96?text=AK',
  },
  {
    name: 'Michał Nowak',
    role: 'Mentor Frontend',
    status: 'away' as const,
    src: '/api/placeholder/96/96?text=MN',
  },
  {
    name: 'Zespół sprzedaży',
    role: 'Kanał zespołowy',
    status: 'busy' as const,
    src: '',
  },
];


const megaMenuColumns: MegaMenuColumn[] = [
  {
    heading: 'Zarządzanie',
    items: [
      { label: 'Pulpit', description: 'Szybki wgląd w KPI platformy.', href: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Kursy', description: 'Tworzenie i aktualizacja katalogu.', href: '/admin/courses', icon: <Layers className="h-4 w-4" /> },
      { label: 'Raporty', description: 'Generowanie raportów PDF/CSV.', href: '/admin/reports', icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    heading: 'Bezpieczeństwo',
    items: [
      { label: 'Role i uprawnienia', description: 'Zarządzanie dostępami zespołu.', href: '/admin/settings#roles', icon: <ShieldCheck className="h-4 w-4" /> },
      { label: 'Logi audytowe', description: 'Monitorowanie aktywności użytkowników.', href: '/admin/monitoring', icon: <LifeBuoy className="h-4 w-4" /> },
      { label: 'Integracje', description: 'API, SSO, webhooki.', href: '/integrations', icon: <Zap className="h-4 w-4" /> },
    ],
  },
];

const resourceContextMenu: Array<Omit<ContextMenuItem, 'onSelect'>> = [
  { label: 'Duplikuj', icon: <Copy className="h-4 w-4" />, shortcut: '⌘D' },
  { label: 'Pobierz .csv', icon: <Download className="h-4 w-4" />, shortcut: '⌘⇧S' },
  { label: 'Edytuj', icon: <PenLine className="h-4 w-4" />, shortcut: 'E' },
  { label: 'Usuń', icon: <Trash2 className="h-4 w-4" />, danger: true },
];

const splitButtonOptions: Array<Omit<SplitButtonOption, 'onSelect'>> = [
  { label: 'Utwórz kurs', description: 'Manualne wprowadzenie programu.' },
  { label: 'Import z CSV', description: 'Zaimportuj dane z pliku.' },
  { label: 'Szablon AI', description: 'Wygeneruj strukturę kursu automatycznie.' },
];

const accordionItems = [
  {
    id: 'governance',
    title: 'Standardy dostępu i uprawnień',
    description: 'Jak konfigurować role, grupy i poziomy uprawnień na platformie.',
    content: (
      <div className="space-y-2">
        <p>Każdy kurs dziedziczy uprawnienia z poziomu organizacji. Możesz nadpisać je na poziomie modułu.</p>
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          <li>Role niestandardowe warto nazywać z prefiksem zespołu (np. DX-Editor).</li>
          <li>Aktywny audyt logów ułatwia wykrywanie eskalacji uprawnień.</li>
        </ul>
      </div>
    ),
    meta: 'Doc v2.1',
  },
  {
    id: 'publishing',
    title: 'Workflow publikacji kursów',
    description: 'Przejrzyj automatyczne powiadomienia i wymagane zatwierdzenia.',
    content: (
      <div className="space-y-2">
        <p>Publikacja wymaga potwierdzenia compliance, marketingu oraz właściciela programu.</p>
        <p className="text-xs text-muted-foreground">Powiadomienia mailowe wysyłamy po każdym etapie weryfikacji.</p>
      </div>
    ),
    meta: 'Workflow',
  },
  {
    id: 'analytics',
    title: 'Raporty i dashboardy',
    description: 'Jak czytać metryki progresu i retencji uczniów.',
    content: (
      <div className="space-y-2">
        <p>Panel analityczny posiada gotowe zestawy KPI dla zarządu, prowadzących i HR.</p>
        <p className="text-xs text-muted-foreground">Eksporty CSV/PDF generowane są co godzinę – możesz je pobrać także ręcznie.</p>
      </div>
    ),
    meta: 'Analytics',
  },
];

const performanceTabs = [
  {
    id: 'overview',
    label: 'Przegląd',
    icon: <LayoutDashboard className="h-4 w-4" />,
    content: (
      <div className="space-y-2">
        <p>Całościowy obraz kondycji platformy – przychody, aktywność użytkowników i retencja.</p>
        <p className="text-xs text-muted-foreground">Aktualizacja danych odbywa się co 15 minut.</p>
      </div>
    ),
  },
  {
    id: 'users',
    label: 'Użytkownicy',
    icon: <Users className="h-4 w-4" />,
    badge: <Badge tone="info" variant="subtle">+128</Badge>,
    content: (
      <div className="space-y-2">
        <p>Segmentacja nowych rejestracji według kanału marketingowego oraz aktywności.</p>
        <p className="text-xs text-muted-foreground">Wyświetlamy także kohorty utrzymania na przestrzeni ostatnich 6 miesięcy.</p>
      </div>
    ),
  },
  {
    id: 'finance',
    label: 'Finanse',
    icon: <DollarSign className="h-4 w-4" />,
    content: (
      <div className="space-y-2">
        <p>Porównanie przychodów i kosztów, prognoza MRR oraz status płatności.</p>
        <p className="text-xs text-muted-foreground">Sygnały ostrzegawcze podświetlamy kolorem amber/rose.</p>
      </div>
    ),
  },
];

const insightsTabs = [
  {
    id: 'stats',
    label: 'Statystyki',
    content: (
      <div className="space-y-2">
        <p>Średni czas ukończenia kursu spadł o 8%, a satysfakcja wzrosła do 92%.</p>
        <p className="text-xs text-muted-foreground">Te dane obejmują wszystkie programy live i on-demand.</p>
      </div>
    ),
  },
  {
    id: 'feedback',
    label: 'Feedback',
    content: (
      <div className="space-y-2">
        <p>Zebraliśmy 124 nowe komentarze, z czego 87% zawiera pozytywne oceny prowadzących.</p>
        <p className="text-xs text-muted-foreground">Najczęstsze sugestie: więcej ćwiczeń praktycznych.</p>
      </div>
    ),
  },
  {
    id: 'experiments',
    label: 'Eksperymenty',
    content: (
      <div className="space-y-2">
        <p>Testujemy nowe onboarding flows – wariant B zwiększył aktywację o 12%.</p>
        <p className="text-xs text-muted-foreground">Eksperyment trwa do końca miesiąca.</p>
      </div>
    ),
  },
];



const testimonials = [
  { id: 1, name: 'Katarzyna W.', role: 'Product Designer', content: 'Platforma pozwoliła mi szybko przeszkolić zespół z nowych narzędzi UX. Uwielbiam interaktywne moduły.', rating: 5 },
  { id: 2, name: 'Michał S.', role: 'Lead Developer', content: 'Możliwość monitorowania postępów w czasie rzeczywistym to game changer. Wszystko w jednym panelu.', rating: 5 },
  { id: 3, name: 'Anna G.', role: 'HR Business Partner', content: 'Świetne raporty, które mogę wysłać do zarządu jednym kliknięciem. Oszczędza mnóstwo czasu.', rating: 5 },
];

const demoCourses = [
  { id: 1, title: 'React dla zespołów', instructor: 'Paweł Kowalski', rating: 4.9, students: 1320, image: '/api/placeholder/400/225', price: 89, category: 'Frontend' },
  { id: 2, title: 'Zarządzanie zmianą', instructor: 'Anna Zielińska', rating: 4.8, students: 980, image: '/api/placeholder/400/225', price: 79, category: 'Leadership' },
  { id: 3, title: 'Data storytelling', instructor: 'Tomasz Lewandowski', rating: 4.7, students: 640, image: '/api/placeholder/400/225', price: 99, category: 'Analytics' },
  { id: 4, title: 'Design Systems w praktyce', instructor: 'Karolina Mazur', rating: 4.9, students: 450, image: '/api/placeholder/400/225', price: 109, category: 'Product Design' },
  { id: 5, title: 'Analytics Engineering', instructor: 'Marek Woźniak', rating: 4.6, students: 520, image: '/api/placeholder/400/225', price: 119, category: 'Data' },
  { id: 6, title: 'Storytelling dla liderów', instructor: 'Paulina Bąk', rating: 4.8, students: 780, image: '/api/placeholder/400/225', price: 99, category: 'Leadership' },
];

const dashboardStats = [
  { title: 'Monthly Revenue', value: '$128,400', change: '+14.2%', icon: DollarSign, color: 'text-blue-600', changeColor: 'text-green-500' },
  { title: 'Active Users', value: '12,540', change: '+4.7%', icon: Users, color: 'text-emerald-600', changeColor: 'text-green-500' },
  { title: 'Course Completion', value: '87%', change: '+2.1%', icon: CheckCircle2, color: 'text-indigo-600', changeColor: 'text-green-500' },
  { title: 'NPS Score', value: '62', change: '+6', icon: BarChart3, color: 'text-purple-600', changeColor: 'text-green-500' },
];

const revenueData = [
  { name: 'Jan', revenue: 32000, expenses: 18000 },
  { name: 'Feb', revenue: 42000, expenses: 22000 },
  { name: 'Mar', revenue: 53000, expenses: 26000 },
  { name: 'Apr', revenue: 61000, expenses: 30000 },
  { name: 'May', revenue: 72000, expenses: 34000 },
  { name: 'Jun', revenue: 84000, expenses: 38000 },
];

const tableColumns: AdminTableColumn<DemoUser>[] = [
  { key: 'name', title: 'Imię i nazwisko', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Rola', sortable: true },
  { key: 'status', title: 'Status', sortable: true, align: 'right' },
];

const tableData: DemoUser[] = [
  { id: '1', name: 'Alicja Nowak', email: 'alicja@edu.io', role: 'Student', status: 'Active' },
  { id: '2', name: 'Dominik Wójcik', email: 'dominik@edu.io', role: 'Instructor', status: 'Invited' },
  { id: '3', name: 'Joanna Kaczmarek', email: 'joanna@edu.io', role: 'Admin', status: 'Active' },
  { id: '4', name: 'Michał Lewandowski', email: 'michal@edu.io', role: 'Student', status: 'Invited' },
  { id: '5', name: 'Karolina Pietrzak', email: 'karolina@edu.io', role: 'Instructor', status: 'Active' },
  { id: '6', name: 'Łukasz Brzeziński', email: 'lukasz@edu.io', role: 'Student', status: 'Suspended' },
  { id: '7', name: 'Ewa Stępień', email: 'ewa@edu.io', role: 'Admin', status: 'Active' },
];

const calendarReference = startOfWeek(new Date());

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = next.getDate() - day + (day === 0 ? -6 : 1);
  next.setDate(diff);
  next.setHours(0, 0, 0, 0);
  return next;
}

function buildEvent(offsetDay: number, startHour: number, durationHours: number, overrides?: Partial<CalendarEvent>): CalendarEvent {
  const start = new Date(calendarReference);
  start.setDate(start.getDate() + offsetDay);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(start);
  end.setHours(startHour + durationHours, 0, 0, 0);
  return {
    id: `${offsetDay}-${startHour}`,
    title: 'Spotkanie zespołu',
    start,
    end,
    color: 'bg-indigo-500',
    ...overrides,
  };
}

const initialCalendarEvents: CalendarEvent[] = [
  buildEvent(0, 9, 2, { title: 'Plan tygodnia', location: 'Teams', category: 'meeting', description: 'Przegląd zadań na nadchodzący tydzień' }),
  buildEvent(1, 11, 1, { title: '1:1 z mentorem', location: 'Sala 3.2', category: 'personal', description: 'Indywidualne spotkanie z mentorem' }),
  buildEvent(2, 13, 1.5, { title: 'Warsztat React', location: 'Sala warsztatowa', category: 'workshop', description: 'Warsztat zaawansowanych wzorców w React' }),
  buildEvent(4, 10, 3, { title: 'Demo sprintu', location: 'Zoom', category: 'demo', description: 'Prezentacja wyników dwutygodniowego sprintu' }),
  buildEvent(3, 14, 1, { title: 'Code review', location: 'Online', category: 'meeting', description: 'Przegląd kodu z zespołem' }),
];

const formFields: AdminFormFieldConfig[] = [
  {
    name: 'name',
    label: 'Imię i nazwisko',
    type: 'text',
    required: true,
    placeholder: 'Wpisz pełne imię i nazwisko',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'adres@edu.io',
    helperText: 'Adres do powiadomień administracyjnych.',
  },
  {
    name: 'role',
    label: 'Rola',
    type: 'select',
    required: true,
    options: [
      { label: 'Student', value: 'Student' },
      { label: 'Instructor', value: 'Instructor' },
      { label: 'Admin', value: 'Admin' },
    ],
  },
  { name: 'status', label: 'Aktywny', type: 'checkbox' },
];

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground transition-colors dark:text-slate-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function BrandbookPage() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formState, setFormState] = useState<Record<string, any> | null>(null);
  const [fieldShowcase, setFieldShowcase] = useState<FieldShowcaseState>({
    name: 'Anna Kowalska',
    email: 'anna@edu.io',
    password: 'Sekret!23',
    price: '89',
    description: 'Opis kursu pozwala zrozumieć zakres materiału.',
    role: 'Student',
    marketing: true,
    notifications: false,
    plan: 'standard',
    search: '',
    phone: '+48 123 456 789',
    pesel: '92051212345',
    brandColor: '#2563EB',
  });
  const [isStatusAlertVisible, setIsStatusAlertVisible] = useState(true);
  const [paginationPage, setPaginationPage] = useState(2);
  const [selectedChips, setSelectedChips] = useState<string[]>(['Design', 'UX']);
  const [activeFilters, setActiveFilters] = useState([
    { label: 'Kategoria: Frontend', count: 12 },
    { label: 'Cena < 99 zł', count: 5 },
  ]);
  const [visibleCoursesCount, setVisibleCoursesCount] = useState(3);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCourseSuggestion, setSelectedCourseSuggestion] = useState<AutocompleteOption | null>(null);
  const [selectedMentorSuggestion, setSelectedMentorSuggestion] = useState<AutocompleteOption | null>(null);
  const [asyncResults, setAsyncResults] = useState<AutocompleteOption[]>(courseSuggestions.slice(0, 4));
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [knowledgeLevel, setKnowledgeLevel] = useState(60);
  const [activeStepperStep, setActiveStepperStep] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([49, 199]);
  const [courseProgress, setCourseProgress] = useState(42);
  const [syncProgress, setSyncProgress] = useState(68);
  const [reviewStepperStep, setReviewStepperStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activePerformanceTab, setActivePerformanceTab] = useState(performanceTabs[0]?.id ?? 'overview');
  const [activeInsightsTab, setActiveInsightsTab] = useState(insightsTabs[0]?.id ?? 'stats');
  const [resourceFilter, setResourceFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [selectedUsers, setSelectedUsers] = useState<DemoUser[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);

  const asyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFieldShowcaseChange = <K extends keyof FieldShowcaseState>(
    key: K,
    value: FieldShowcaseState[K],
  ) => {
    setFieldShowcase((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleModalConfirm = () => {
    setModalLoading(true);
    setTimeout(() => {
      showToast({
        title: 'Potwierdzono',
        description: 'Akcja została zatwierdzona.',
        variant: 'success',
      });
      setModalLoading(false);
      setIsModalOpen(false);
    }, 1200);
  };

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((item) => item !== chip) : [...prev, chip],
    );
  };

  const removeFilter = (label: string) => {
    setActiveFilters((prev) => prev.filter((filter) => filter.label !== label));
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCoursesCount((prev) => Math.min(prev + 3, demoCourses.length));
      setLoadingMore(false);
    }, 600);
  };

  const handleAsyncQuery = useCallback(
    (userQuery: string) => {
      if (asyncTimeoutRef.current) {
        clearTimeout(asyncTimeoutRef.current);
      }
      setAutocompleteLoading(true);
      asyncTimeoutRef.current = setTimeout(() => {
        const normalized = userQuery.toLowerCase();
        const results = normalized
          ? mentorSuggestions.filter((option) =>
              option.label.toLowerCase().includes(normalized) ||
              option.description?.toLowerCase().includes(normalized),
            )
          : mentorSuggestions;
        setAsyncResults(results);
        setAutocompleteLoading(false);
      }, 450);
    },
    [],
  );

  const handleFilesChange = useCallback(
    (files: File[]) => {
      setUploadedFiles(files);
      if (files.length === 0) {
        showToast({
          title: 'Brak plików',
          description: 'Wyczyść pliki lub dodaj nowe, aby kontynuować.',
          variant: 'info',
        });
        return;
      }
      showToast({
        title: files.length > 1 ? 'Pliki dodane' : 'Plik dodany',
        description: files.map((file) => file.name).join(', '),
        variant: 'success',
      });
    },
    [showToast],
  );

  const handleClearFiles = useCallback(() => {
    setUploadedFiles([]);
    showToast({
      title: 'Wyczyszczono listę',
      description: 'Możesz ponownie wybrać pliki do przesłania.',
      variant: 'info',
    });
  }, [showToast]);

  const handleCalendarSlotCreate = useCallback(
    (start: Date, end: Date) => {
      const newEvent: CalendarEvent = {
        id: `draft-${Date.now()}`,
        title: 'Nowe spotkanie',
        start,
        end,
        category: 'meeting',
        location: 'Do ustalenia',
        description: 'Kliknij prawym przyciskiem aby edytować'
      };
      setCalendarEvents((prev) => [...prev, newEvent]);
      showToast({
        title: 'Dodano szkic wydarzenia',
        description: `${start.toLocaleDateString()} • ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        variant: 'info',
      });
    },
    [showToast],
  );

  const handleCalendarEventClick = useCallback(
    (event: CalendarEvent) => {
      showToast({
        title: event.title,
        description: `${event.location ?? 'Spotkanie online'} • ${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        variant: 'success',
      });
    },
    [showToast],
  );

  const handleCalendarEventUpdate = useCallback(
    (eventId: string, updates: Partial<CalendarEvent>) => {
      setCalendarEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, ...updates } : event
        )
      );
      showToast({
        title: 'Zaktualizowano wydarzenie',
        description: 'Zmiany zostały zapisane',
        variant: 'success',
      });
    },
    [showToast],
  );

  const handleCalendarEventDelete = useCallback(
    (eventId: string) => {
      setCalendarEvents((prev) => prev.filter((event) => event.id !== eventId));
      showToast({
        title: 'Usunięto wydarzenie',
        description: 'Wydarzenie zostało trwale usunięte',
        variant: 'info',
      });
    },
    [showToast],
  );

  const handleCalendarEventDuplicate = useCallback(
    (event: CalendarEvent) => {
      const duplicatedEvent: CalendarEvent = {
        ...event,
        id: `duplicate-${Date.now()}`,
        title: `${event.title} (kopia)`,
        start: new Date(event.start.getTime() + 24 * 60 * 60 * 1000), // +1 dzień
        end: new Date(event.end.getTime() + 24 * 60 * 60 * 1000), // +1 dzień
      };
      setCalendarEvents((prev) => [...prev, duplicatedEvent]);
      showToast({
        title: 'Zduplikowano wydarzenie',
        description: `Utworzono kopię na ${duplicatedEvent.start.toLocaleDateString()}`,
        variant: 'success',
      });
    },
    [showToast],
  );

  useEffect(() => () => {
    if (asyncTimeoutRef.current) {
      clearTimeout(asyncTimeoutRef.current);
    }
  }, []);

  const contextMenuItems = useMemo(() =>
    resourceContextMenu.map((item) => ({
      ...item,
      onSelect: () =>
        showToast({
          title: item.label,
          description: `Akcja '${item.label}' została wywołana`,
          variant: item.danger ? 'error' : 'info',
        }),
    })),
  [showToast]);

  const splitButtonItems = useMemo(() =>
    splitButtonOptions.map((option) => ({
      ...option,
      onSelect: () =>
        showToast({
          title: option.label,
          description: 'Dodano wpis przy użyciu menu przycisku.',
          variant: 'success',
        }),
    })),
  [showToast]);

  const summarizedRoles = useMemo(() => {
    return tableData.reduce<Record<string, number>>((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
  }, []);

  return (
    <div className="min-h-screen bg-muted/50 pb-24 transition-colors dark:bg-slate-950">
      <div className="relative isolate bg-gradient-to-br from-blue-50 via-white to-slate-100 transition-colors dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="absolute inset-0 bg-grid-slate-100/40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_65%)] dark:bg-slate-900/30" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="mb-8 flex justify-end">
            <ThemeToggle />
          </div>
          <div className="max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Brandbook</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              System projektowy EduPlatform
            </h1>
            <p className="text-lg text-muted-foreground">
              Przewodnik po tożsamości wizualnej, komponentach UI i zachowaniach interaktywnych naszej platformy.
              Każdy element posiada żywy przykład oraz wskazówki implementacyjne.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  showToast({
                    title: 'Brandbook załadowany',
                    description: 'Możesz testować komponenty w czasie rzeczywistym.',
                    variant: 'info',
                  })
                }
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Pokaż toast kontrolny
              </Button>
              <Button
                variant="secondary"
                className="border border-blue-100 bg-card text-blue-600 hover:bg-blue-50"
                onClick={() => setIsModalOpen(true)}
              >
                Otwórz demo modala
              </Button>
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-slate-100"
                onClick={() => window.open('/components', '_blank')}
              >
                Katalog komponentów <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl space-y-16 px-6 lg:px-8">
        <Section
          title="Paleta kolorów"
          description="Fundamentalne kolory wykorzystywane w interfejsie użytkownika. Zachowujemy wysoki kontrast oraz konsekwencję w użyciu."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {palette.map((color) => (
              <Card key={color.name} className="border border-border">
                <div className="h-24 rounded-t-lg" style={{ backgroundColor: color.value }} />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-foreground">{color.name}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{color.usage}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <span className="text-sm font-mono text-muted-foreground">{color.value}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="Integracja z Tailwind"
          description="Ujednolicona konfiguracja tematów pozwala komponentom shadcn i customowym blokom korzystać z identycznej palety."
        >
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Poniżej proponowane rozszerzenia <code>tailwind.config.js</code>; mapują one odcienie z brandbooka na skrócone
              nazwy (`primary`, `warning`, `muted`). Po edycji uruchom ponownie proces buildu, aby Tailwind przebudował klasy,
              a w komponentach shadcn zacznij używać par <code>bg-*-</code> i <code>text-*-foreground</code>, np.
              <code>className=&quot;bg-primary text-primary-foreground&quot;</code>.
            </p>
            <pre className="overflow-auto rounded-lg bg-slate-900 px-4 py-3 text-xs text-slate-100">
{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#F8FAFC',
        foreground: '#0F172A',
        primary: {
          DEFAULT: '#2563EB',
          foreground: '#F8FAFC',
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#334155',
          foreground: '#F1F5F9',
        },
        accent: {
          DEFAULT: '#E0F2FE',
          foreground: '#0F172A',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#F0FDF4',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#F43F5E',
          foreground: '#FEF2F2',
        },
        muted: {
          DEFAULT: '#CBD5F5',
          foreground: '#475569',
        },
        card: '#FFFFFF',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        panel: '0 30px 60px -25px rgba(15, 23, 42, 0.25)',
      },
    },
  },
};`}
            </pre>
            <p className="text-xs text-muted-foreground">
              Po zapisaniu konfiguracji zrestartuj serwer deweloperski lub ponownie uruchom <code>npm run dev</code>, aby
              wygenerować klasy i uniknąć błędów typu “unknown variant”.
            </p>
          </div>
        </Section>

        <Section title="Typografia" description="Inter wykorzystujemy jako podstawowy krój w całym ekosystemie.">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
            {typographySamples.map((sample) => (
              <div key={sample.label} className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">{sample.label}</p>
                <p className={sample.className}>{sample.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Przyciski"
          description="Warianty Button bazują na komponentach shadcn. Możemy nadpisywać klasę, aby dopasować do brandingu."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Podstawowe warianty</CardTitle>
                <CardDescription>Poniżej warianty najczęściej stosowane w marketingu i panelu admina.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Primary</Button>
                <Button variant="secondary" className="bg-slate-800 text-white hover:bg-slate-900">
                  Secondary
                </Button>
                <Button variant="outline" className="border-border text-foreground hover:bg-slate-100">
                  Outline
                </Button>
                <Button variant="ghost" className="hover:bg-slate-100 text-foreground">
                  Ghost
                </Button>
                <Button variant="destructive" className="bg-rose-500 text-white hover:bg-rose-600">
                  Destructive
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Akcje globalne</CardTitle>
                <CardDescription>Przykłady wykorzystania przycisków do wyzwalania kontrolerów modal i toast.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-3">
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() =>
                    showToast({
                      title: 'Użytkownik zapisany',
                      description: 'Dane zostały poprawnie utrwalone.',
                      variant: 'success',
                    })
                  }
                >
                  Pokaż toast sukcesu
                </Button>
                <Button
                  variant="outline"
                  className="border-rose-300 text-rose-600 hover:bg-rose-50"
                  onClick={() =>
                    showToast({
                      title: 'Nie udało się zapisać',
                      description: 'Sprawdź połączenie z API i spróbuj ponownie.',
                      variant: 'error',
                    })
                  }
                >
                  Pokaż toast błędu
                </Button>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => setIsModalOpen(true)}>
                  Otwórz modal potwierdzający
                </Button>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Komponenty marketingowe"
          description="Zestaw gotowych bloków wykorzystywanych na stronie publicznej."
        >
          <div className="space-y-10">
            <ComponentShowcase
              title="Hero + Navigation"
              description="Główna sekcja landing page z nawigacją, CTA i obrazem hero"
              code={`<Navigation
  navItems={[
    { name: 'Home', href: '#' },
    { name: 'Katalog', href: '#courses' },
    { name: 'Brandbook', href: '/brandbook' }
  ]}
  ctaText="Dołącz"
/>

<Hero
  title="Zbuduj kulturę ciągłego rozwoju"
  subtitle="Nowoczesne kursy, live session i społeczność ekspertów."
  ctaText="Przetestuj platformę"
  ctaAction={() => handleAction()}
  secondaryCtaText="Zobacz wideo"
  secondaryCtaAction={() => setIsModalOpen(true)}
  imageUrl="/images/hero-edu.svg"
  altText="Hero EduPlatform"
/>`}
            >
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <Navigation navItems={[{ name: 'Home', href: '#' }, { name: 'Katalog', href: '#courses' }, { name: 'Brandbook', href: '/brandbook' }]} ctaText="Dołącz" />
                <Hero
                  title="Zbuduj kulturę ciągłego rozwoju"
                  subtitle="Nowoczesne kursy, live session i społeczność ekspertów — wszystko w jednym miejscu."
                  ctaText="Przetestuj platformę"
                  ctaAction={() =>
                    showToast({
                      title: 'Demo hero',
                      description: 'CTA w hero może prowadzić do darmowego triala.',
                      variant: 'info',
                    })
                  }
                  secondaryCtaText="Zobacz wideo"
                  secondaryCtaAction={() => setIsModalOpen(true)}
                  imageUrl="/images/hero-edu.svg"
                  altText="Hero EduPlatform"
                />
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Bloki informacyjne"
              description="Statystyki i funkcje użyte do budowania zaufania użytkowników"
              variants={[
                {
                  name: 'Stats',
                  code: `const stats = [
  { number: '50K+', label: 'Aktywnych studentów' },
  { number: '200+', label: 'Kursów premium' },
  { number: '98%', label: 'Satysfakcji' },
  { number: '24/7', label: 'Wsparcia' },
];

<Stats stats={stats} />`,
                  component: <Stats stats={marketingStats} />
                },
                {
                  name: 'Features',
                  code: `const features = [
  {
    title: 'Eksperci branżowi',
    description: 'Zajęcia prowadzone przez liderów rynku.',
    icon: '🎓'
  },
  {
    title: 'Elastyczne ścieżki',
    description: 'Łącz moduły kursów, aby tworzyć własne ścieżki.',
    icon: '🧭'
  },
  // ...
];

<Features features={features} />`,
                  component: <Features features={marketingFeatures} />
                }
              ]}
            />

            <ComponentShowcase
              title="Testimonial Slider"
              description="Karuzela opinii z interaktywną nawigacją"
              code={`const testimonials = [
  {
    id: 1,
    name: 'Katarzyna W.',
    role: 'Product Designer',
    content: 'Platforma pozwoliła mi szybko przeszkolić zespół...',
    rating: 5
  },
  // ...więcej opinii
];

<TestimonialSlider testimonials={testimonials} />`}
            >
              <TestimonialSlider testimonials={testimonials} />
            </ComponentShowcase>

            <ComponentShowcase
              title="Karty kursów"
              description="Przykładowe kursy prezentowane w siatce 3 kolumnowej"
              code={`const course = {
  id: 1,
  title: 'React dla zespołów',
  instructor: 'Paweł Kowalski',
  rating: 4.9,
  students: 1320,
  image: '/api/placeholder/400/225',
  price: 89,
  category: 'Frontend'
};

<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {demoCourses.map((course) => (
    <CourseCard key={course.id} course={course} />
  ))}
</div>`}
            >
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {demoCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Call to Action (CTA)"
              description="Sekcja zachęcająca do działania z dwoma przyciskami i wyborem koloru tła"
              code={`<CTA
  title="Zacznij onboardować swój zespół"
  subtitle="Skorzystaj z darmowych 14 dni..."
  primaryButtonText="Rozpocznij darmowy okres"
  primaryButtonAction={() => {
    // Akcja głównego przycisku
  }}
  secondaryButtonText="Umów demo"
  secondaryButtonAction={() => {
    // Akcja drugiego przycisku
  }}
  bgColor="blue"
/>`}
            >
              <CTA
                title="Zacznij onboardować swój zespół"
                subtitle="Skorzystaj z darmowych 14 dni i odkryj pełne możliwości EduPlatform."
                primaryButtonText="Rozpocznij darmowy okres"
                primaryButtonAction={() =>
                  showToast({
                    title: 'Start okresu próbnego',
                    description: 'Skontaktujemy się z Tobą w ciągu 24 godzin.',
                    variant: 'success',
                  })
                }
                secondaryButtonText="Umów demo"
                secondaryButtonAction={() => setIsModalOpen(true)}
                bgColor="blue"
              />
            </ComponentShowcase>
          </div>
        </Section>

        <Section
          title="Pola formularzy"
          description="Nowe komponenty formularzy dostępne w bibliotece frontendu. Zachowują jednolite stany, pomoc i komunikaty błędów."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Pola tekstowe</CardTitle>
                <CardDescription>Warianty pojedynczej linii, pola hasła, liczby oraz textarea z helperami.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <TextField
                    id="showcase-name"
                    label="Imię i nazwisko"
                    placeholder="Wpisz imię i nazwisko"
                    helperText="Posługuj się pełnymi danymi użytkownika."
                    value={fieldShowcase.name}
                    onChange={(event) =>
                      handleFieldShowcaseChange('name', event.target.value)
                    }
                  />
                  <TextField
                    id="showcase-email"
                    type="email"
                    label="Email"
                    placeholder="uzytkownik@edu.io"
                    helperText="Adres wykorzystywany do logowania oraz powiadomień."
                    value={fieldShowcase.email}
                    onChange={(event) =>
                      handleFieldShowcaseChange('email', event.target.value)
                    }
                  />
                  <PasswordField
                    id="showcase-password"
                    label="Hasło"
                    helperText="Hasło musi mieć min. 8 znaków, w tym cyfrę i znak specjalny."
                    value={fieldShowcase.password}
                    onChange={(event) =>
                      handleFieldShowcaseChange('password', event.target.value)
                    }
                  />
                <NumberField
                  id="showcase-price"
                  label="Cena kursu"
                  helperText="Wartość netto w PLN."
                  min="0"
                  step="1"
                  value={fieldShowcase.price}
                  onChange={(event) =>
                    handleFieldShowcaseChange('price', event.target.value)
                  }
                />
                <ColorPickerField
                  id="showcase-brand-color"
                  label="Kolor przewodni"
                  helperText="Służy do personalizacji hero, CTA i wykresów."
                  value={fieldShowcase.brandColor}
                  onChange={(event) =>
                    handleFieldShowcaseChange('brandColor', event.target.value)
                  }
                />
                <InputMaskField
                  id="showcase-phone"
                  label="Telefon kontaktowy"
                  helperText="Maska kontroluje format numeru, dzięki czemu eksporty CSV zachowują spójność."
                  mask="+## ### ### ###"
                  value={fieldShowcase.phone}
                  onMaskedValueChange={(masked) =>
                    handleFieldShowcaseChange('phone', masked)
                  }
                />
                <InputMaskField
                  id="showcase-pesel"
                  label="PESEL uczestnika"
                  helperText="11 cyfr – maska blokuje wprowadzanie liter oraz dodatkowych znaków."
                  mask="###########"
                  value={fieldShowcase.pesel}
                  onMaskedValueChange={(masked) =>
                    handleFieldShowcaseChange('pesel', masked)
                  }
                />
                  <TextareaField
                    id="showcase-description"
                    label="Opis kursu"
                    helperText="Krótko przedstaw korzyści. Pole wspiera stany błędów i dowolną wysokość."
                    value={fieldShowcase.description}
                    onChange={(event) =>
                      handleFieldShowcaseChange('description', event.target.value)
                    }
                  />
                </form>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Pola wyboru</CardTitle>
                <CardDescription>Komponenty wyboru pojedynczego i wielokrotnego z obsługą stanów i fokusów.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SelectField
                  id="showcase-role"
                  label="Rola użytkownika"
                  helperText="Wpływa na uprawnienia w panelu."
                  value={fieldShowcase.role}
                  onChange={(event) =>
                    handleFieldShowcaseChange('role', event.target.value)
                  }
                  options={[
                    { label: 'Student', value: 'Student' },
                    { label: 'Instructor', value: 'Instructor' },
                    { label: 'Admin', value: 'Admin' },
                  ]}
                />
                <RadioGroupField
                  name="showcase-plan"
                  label="Plan subskrypcji"
                  helperText="Wybierz plan najlepiej dopasowany do zespołu."
                  value={fieldShowcase.plan}
                  orientation="horizontal"
                  options={[
                    { label: 'Basic', value: 'basic' },
                    { label: 'Standard', value: 'standard' },
                    { label: 'Premium', value: 'premium' },
                  ]}
                  onChange={(value) =>
                    handleFieldShowcaseChange('plan', value)
                  }
                />
                <CheckboxField
                  id="showcase-marketing"
                  label="Zgoda marketingowa"
                  description="Pozwala wysyłać nowości produktowe."
                  helperText="Wymagana przy wysyłce newslettera."
                  checked={fieldShowcase.marketing}
                  onCheckedChange={(checked) =>
                    handleFieldShowcaseChange('marketing', checked)
                  }
                />
                <SwitchField
                  id="showcase-notifications"
                  label="Powiadomienia push"
                  description="Szybkie przypomnienia o ważnych wydarzeniach."
                  checked={fieldShowcase.notifications}
                  onCheckedChange={(checked) =>
                    handleFieldShowcaseChange('notifications', checked)
                  }
                />
                <SearchField
                  id="showcase-search"
                  placeholder="Szukaj kursów lub instruktorów…"
                  helperText="Wspiera skróty klawiszowe oraz stany błędów."
                  value={fieldShowcase.search}
                  onChange={(event) =>
                    handleFieldShowcaseChange('search', event.target.value)
                  }
                />
              </CardContent>
              <CardFooter>
                <pre className="w-full overflow-x-auto rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-100">
{JSON.stringify(
  {
    role: fieldShowcase.role,
    plan: fieldShowcase.plan,
    marketing: fieldShowcase.marketing,
    notifications: fieldShowcase.notifications,
    search: fieldShowcase.search,
    brandColor: fieldShowcase.brandColor,
  },
  null,
  2,
)}
                </pre>
              </CardFooter>
            </Card>
          </div>
        </Section>

        <Section
          title="Ładowanie plików"
          description="Spójny komponent uploadu obsługuje drag & drop, limit rozmiaru oraz podgląd wybranych plików."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Uploader zasobów kursu</CardTitle>
                <CardDescription>Dodaj materiały PDF lub grafiki promocyjne. Komponent informuje o limitach i błędach.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUploader
                  label="Materiały do modułu"
                  description="Wspierane formaty: PDF, PNG, JPG. Maksymalnie 10 MB na plik."
                  helperText="Po dodaniu plików kliknij „Wyślij do biblioteki”, aby zainicjować upload do API."
                  accept=".pdf,image/png,image/jpeg"
                  multiple
                  maxSizeMB={10}
                  value={uploadedFiles}
                  onFilesChange={handleFilesChange}
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() =>
                      showToast({
                        title: 'Upload symulowany',
                        description: uploadedFiles.length
                          ? `Wysłano ${uploadedFiles.length} plików do kolejki.`
                          : 'Brak plików do przesłania.',
                        variant: uploadedFiles.length ? 'success' : 'warning',
                      })
                    }
                    disabled={uploadedFiles.length === 0}
                  >
                    Wyślij do biblioteki
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClearFiles}
                    disabled={uploadedFiles.length === 0}
                  >
                    Wyczyść listę
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Wytyczne produktowe</CardTitle>
                <CardDescription>Najważniejsze zasady projektowe dla uploadu plików w panelu administracyjnym.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>• Drag & drop i przycisk akcji zawsze współistnieją, aby zachować dostępność.</li>
                  <li>• Błędy walidacji (limit rozmiaru, format) pojawiają się pod strefą drop wraz z listą odrzuconych plików.</li>
                  <li>• Po dodaniu elementów wyświetlamy ich nazwę oraz rozmiar; opcja „Usuń” jest zawsze dostępna.</li>
                  <li>• W uploadzie krokowym stosujemy toast potwierdzający sukces, a w tle wysyłamy dane asynchronicznie.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Autocomplete"
          description="Pole typu typeahead z filtrowaniem lokalnym i zdalnym."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Statyczna lista kursów</CardTitle>
                <CardDescription>Filtruje dane lokalnie, pozwala wybrać kurs i zapisuje wynik.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Autocomplete
                  options={courseSuggestions}
                  placeholder="Szukaj kursu…"
                  onOptionSelect={(option) => {
                    setSelectedCourseSuggestion(option);
                    showToast({
                      title: 'Wybrano kurs',
                      description: option.label,
                      variant: 'success',
                    });
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  {selectedCourseSuggestion
                    ? `Wybrano: ${selectedCourseSuggestion.label}`
                    : 'Nie wybrano kursu.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Podpowiedzi asynchroniczne</CardTitle>
                <CardDescription>Symuluje zapytanie do API – spinner informuje o ładowaniu.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Autocomplete
                  options={asyncResults}
                  placeholder="Szukaj mentora…"
                  onOptionSelect={(option) => setSelectedMentorSuggestion(option)}
                  onQueryChange={handleAsyncQuery}
                  loading={autocompleteLoading}
                  emptyMessage="Brak mentorów spełniających kryteria."
                />
                <p className="text-xs text-muted-foreground">
                  {selectedMentorSuggestion
                    ? `Mentor: ${selectedMentorSuggestion.label}`
                    : 'Wybierz mentora z listy.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Suwak (Slider)"
          description="Regulacja wartości liczbowych – np. poziomu zaawansowania lub intensywności programu."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Poziom zaawansowania kursu</CardTitle>
                <CardDescription>Ustaw procent wiedzy wymagany do udziału w warsztatach.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={knowledgeLevel}
                  onValueChange={(value) => setKnowledgeLevel(value)}
                />
                <p className="text-xs text-muted-foreground">
                  Aktualny poziom: <span className="font-semibold text-foreground">{knowledgeLevel}%</span> – uczestnik powinien znać podstawy JavaScriptu i Reacta.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Zakres cenowy</CardTitle>
                <CardDescription>RangeSlider pozwala filtrować katalog kursów po budżecie.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <RangeSlider
                  min={0}
                  max={500}
                  step={5}
                  value={priceRange}
                  minDistance={20}
                  onValueChange={(value) => setPriceRange(value)}
                />
                <p className="text-xs text-muted-foreground">
                  Pokazywane kursy z przedziału{' '}
                  <span className="font-semibold text-foreground">
                    {priceRange[0]}–{priceRange[1]} zł
                  </span>
                  . Filtr zachowuje minimalny odstęp 20 zł między skrajnymi wartościami.
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Kontrolki dat i czasu"
          description="Komponenty inputów daty, czasu i daty z godziną – spójnie wystylizowane z formularzami."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Data</CardTitle>
                <CardDescription>Wybierz termin odsłony kursu.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <DatePicker
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {selectedDate ? `Wybrana data: ${selectedDate}` : 'Nie wybrano daty.'}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Godzina</CardTitle>
                <CardDescription>Planowanie webinaru lub spotkania live.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <TimePicker
                  value={selectedTime}
                  onChange={(event) => setSelectedTime(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {selectedTime ? `Wybrana godzina: ${selectedTime}` : 'Nie wybrano godziny.'}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Data i godzina</CardTitle>
                <CardDescription>Idealne do ustalenia terminu startu kursu.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <DateTimePicker
                  value={selectedDateTime}
                  onChange={(event) => setSelectedDateTime(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {selectedDateTime ? `Start: ${selectedDateTime}` : 'Nie wybrano daty startu.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Step-by-step (Stepper)"
          description="Wizualizuje postęp w wieloetapowych procesach konfiguracji."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Onboarding nowego kursu</CardTitle>
                <CardDescription>Rozbudowany stepper prezentuje szczegóły kroku w panelu poniżej.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Stepper
                  steps={onboardingSteps}
                  activeStep={activeStepperStep}
                  onStepChange={(step) => setActiveStepperStep(step)}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Aktualny krok: <span className="font-semibold text-foreground">{onboardingSteps[activeStepperStep]?.title}</span>
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setActiveStepperStep((prev) =>
                        prev + 1 < onboardingSteps.length ? prev + 1 : 0,
                      )
                    }
                  >
                    Następny etap
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Przegląd jakościowy</CardTitle>
                <CardDescription>Wariant pionowy z ręcznie ustawionymi statusami – podkreśla etapy review.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Stepper
                  steps={reviewWorkflowSteps}
                  activeStep={reviewStepperStep}
                  orientation="vertical"
                  showStepContent={true}
                  onStepChange={(step) => setReviewStepperStep(step)}
                />
                <p className="text-xs text-muted-foreground">
                  Etap <span className="font-semibold text-foreground">{reviewWorkflowSteps[reviewStepperStep]?.title}</span> — {reviewWorkflowSteps[reviewStepperStep]?.meta}.
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Akordeon"
          description="Porządkuje rozbudowane treści – np. dokumentację, polityki lub FAQ w panelu."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Centrum wiedzy</CardTitle>
                <CardDescription>Zastosowanie w sekcji pomocy administratora – każdy moduł zawiera skrócone zasady.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion
                  items={accordionItems}
                  defaultExpandedIds={['governance']}
                  allowMultiple
                />
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Wytyczne projektowe</CardTitle>
                <CardDescription>Stosuj akordeon do treści, które wymagają skupienia – unikaj zagnieżdżonych akordeonów.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Upewnij się, że nagłówki akordeonu w pełni opisują zawartość sekcji.</li>
                  <li>Przy dłuższych blokach tekstu dodaj link „Więcej” prowadzący do pełnej dokumentacji.</li>
                  <li>W przypadku błędów formularza – rozwiń automatycznie sekcję, w której znajduje się invalid field.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Zakładki (Tabs)"
          description="Usprawniają przełączanie widoków równorzędnych – dashboardy, raporty czy analitykę."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Dashboard kierowniczy</CardTitle>
                <CardDescription>Główne zakładki łączą ikony i badge, aby podkreślić ważne zmiany.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  tabs={performanceTabs}
                  value={activePerformanceTab}
                  onValueChange={setActivePerformanceTab}
                  fitted
                />
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Insights zespołu produktu</CardTitle>
                <CardDescription>Wariant pionowy nadaje się do paneli bocznych i stron ustawień.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  tabs={insightsTabs}
                  value={activeInsightsTab}
                  onValueChange={setActiveInsightsTab}
                  orientation="vertical"
                />
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Siatka układu"
          description="LayoutGrid porządkuje sekcje w responsywne kolumny – przydatne w dashboardach, stronach raportowych i overview."
        >
          <LayoutGrid columns={{ base: 1, md: 2 }} gap="lg">
            <LayoutSection
              title="Planowanie programu"
              description="Najważniejsze bloki konfiguracji kursu z przyciskami szybkiego dostępu."
              actions={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    showToast({
                      title: 'Dodano moduł',
                      description: 'Nowy moduł został dodany do planu kursu.',
                      variant: 'success',
                    })
                  }
                >
                  Dodaj moduł
                </Button>
              }
            >
              <List
                variant="check"
                items={[
                  'Zdefiniuj cele edukacyjne i czas trwania',
                  'Przypisz mentorów i konsultacje live',
                  'Ustal materiały do pobrania i quizy',
                ]}
              />
            </LayoutSection>
            <LayoutSection
              title="Metryki opublikowanych kursów"
              description="Szybki wgląd w liczbę aktywnych uczestników, ukończonych modułów i średnią ocen."
            >
              <LayoutGrid columns={{ base: 1, sm: 2 }} gap="sm">
                <StatCard
                  label="Aktywni uczestnicy"
                  value="2 430"
                  trend={12.4}
                  description="Wzrost w ostatnim kwartale."
                />
                <StatCard
                  label="Średnia ocena"
                  value="4.8/5"
                  trend={0.6}
                  description="Na podstawie 1 120 opinii kursantów."
                />
              </LayoutGrid>
            </LayoutSection>
          </LayoutGrid>
        </Section>

        <Section
          title="Listy"
          description="Spójne zachowanie wypunktowań w panelu – listy standardowe, numerowane i checklisty do komunikowania kroków."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Lista standardowa</CardTitle>
                <CardDescription>Polecana do krótkich list korzyści lub wymagań.</CardDescription>
              </CardHeader>
              <CardContent>
                <List
                  items={[
                    'Dostęp do 200+ kursów specjalistycznych.',
                    'Moduły na żywo z mentorem.',
                    'Certyfikaty potwierdzające ukończenie.',
                  ]}
                />
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Lista numerowana</CardTitle>
                <CardDescription>Idealna do procesów i sekwencyjnych instrukcji.</CardDescription>
              </CardHeader>
              <CardContent>
                <List
                  variant="ordered"
                  items={[
                    'Zbierz wymagania od właściciela programu.',
                    'Zaprojektuj strukturę modułów i quizów.',
                    'Przekaż kurs do weryfikacji compliance.',
                  ]}
                />
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Checklisty zatwierdzeń</CardTitle>
                <CardDescription>Podkreśla wykonane kroki – wykorzystuje ikonę sukcesu.</CardDescription>
              </CardHeader>
              <CardContent>
                <List
                  variant="check"
                  markerColor="text-emerald-500"
                  items={[
                    'Materiały wideo sprawdzone przez QA.',
                    'Quiz końcowy uzupełniony o feedback.',
                    'Opis sprzedażowy zaakceptowany przez marketing.',
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Karty KPI / Statystyki"
          description="StatCard wizualizuje kluczowe liczby, trendy i krótkie komentarze – stosuj w dashboardach kierowniczych."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <StatCard
              label="Przychód MRR"
              value="128 400 zł"
              trend={8.3}
              description="Wzrost miesiąc do miesiąca dzięki planom premium."
              icon={<DollarSign className="h-5 w-5" />}
            />
            <StatCard
              label="Retencja 30-dniowa"
              value="87%"
              trend={-2.1}
              description="Spadek spowodowany sezonem urlopowym – monitoruj cohorty."
              icon={<ShieldCheck className="h-5 w-5" />}
            />
            <StatCard
              label="Średni czas ukończenia"
              value="6 h 20 min"
              trend={0}
              trendLabel="Bez zmian"
              description="Cele spełniają rekomendacje L&D dla kursów blended."
              icon={<Clock className="h-5 w-5" />}
            />
          </div>
        </Section>

        <Section
          title="Toolbar"
          description="Pasek narzędzi łączy akcje kontekstowe i filtry – idealny dla list zasobów oraz widoków bulk actions."
        >
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Zarządzanie kursami</CardTitle>
              <CardDescription>Toolbar reaguje na filtr, tryb widoku i pozwala na wywołanie akcji zbiorczych.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Toolbar dense>
                <ToolbarGroup className="gap-1.5">
                  <Button
                    size="sm"
                    variant={resourceFilter === 'all' ? 'default' : 'secondary'}
                    onClick={() => setResourceFilter('all')}
                  >
                    Wszystkie
                  </Button>
                  <Button
                    size="sm"
                    variant={resourceFilter === 'published' ? 'default' : 'secondary'}
                    onClick={() => setResourceFilter('published')}
                  >
                    Opublikowane
                  </Button>
                  <Button
                    size="sm"
                    variant={resourceFilter === 'draft' ? 'default' : 'secondary'}
                    onClick={() => setResourceFilter('draft')}
                  >
                    Szkice
                  </Button>
                </ToolbarGroup>
                <ToolbarSeparator />
                <ToolbarGroup className="gap-1.5">
                  <Button
                    size="sm"
                    variant={layoutMode === 'grid' ? 'default' : 'secondary'}
                    onClick={() => setLayoutMode('grid')}
                  >
                    Siatka
                  </Button>
                  <Button
                    size="sm"
                    variant={layoutMode === 'list' ? 'default' : 'secondary'}
                    onClick={() => setLayoutMode('list')}
                  >
                    Lista
                  </Button>
                </ToolbarGroup>
                <ToolbarSeparator />
                <ToolbarGroup>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      showToast({
                        title: 'Udostępniono',
                        description: 'Wybrane kursy otrzymały dostęp dla nowej grupy.',
                        variant: 'success',
                      })
                    }
                  >
                    Udostępnij
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      showToast({
                        title: 'Eksport rozpoczęty',
                        description: 'Plik CSV pojawi się w sekcji powiadomień po zakończeniu.',
                        variant: 'info',
                      })
                    }
                  >
                    Eksportuj
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      showToast({
                        title: 'Przeniesiono do archiwum',
                        description: '3 kursy zostały oznaczone jako archived.',
                        variant: 'warning',
                      })
                    }
                  >
                    Archiwizuj
                  </Button>
                </ToolbarGroup>
              </Toolbar>
              <p className="text-xs text-muted-foreground">
                Widok: <span className="font-semibold text-foreground">{layoutMode === 'grid' ? 'Siatka' : 'Lista'}</span>, Filtr: <span className="font-semibold text-foreground">{resourceFilter === 'all' ? 'Wszystkie kursy' : resourceFilter === 'draft' ? 'Szkice' : 'Opublikowane'}</span>.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="Nagłówki sekcji"
          description="SectionHeader zapewnia spójny wygląd nagłówków sekcji z opcjonalnym eyebrowem i akcjami."
        >
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Przykłady zastosowania</CardTitle>
              <CardDescription>Używaj w dashboardach, listach raportów oraz w dokumentacji UI, aby zachować konsekwentny rytm typografii.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SectionHeader
                eyebrow="Raport tygodniowy"
                title="Stan realizacji OKR"
                description="Podsumowanie najważniejszych inicjatyw wraz z możliwością eksportu szczegółów."
                actions={
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      showToast({
                        title: 'Eksport OKR',
                        description: 'Raport został dodany do kolejki eksportów.',
                        variant: 'info',
                      })
                    }
                  >
                    Eksportuj
                  </Button>
                }
              />
              <SectionHeader
                align="center"
                title="Harmonogram wydarzeń"
                description="Prezentacja nadchodzących webinarów i warsztatów w ujęciu miesięcznym."
              />
              <SectionHeader
                align="right"
                eyebrow="Ankiety"
                title="Insight od uczestników"
                description="Skup się na trendach i wnioskach – dane surowe dostępne w zakładce „Analiza”."
                actions={
                  <Button
                    size="sm"
                    onClick={() =>
                      showToast({
                        title: 'Dodano ankietę',
                        description: 'Nowa ankieta została wysłana do aktywnych kursantów.',
                        variant: 'success',
                      })
                    }
                  >
                    Wyślij ankietę
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </Section>

        <Section
          title="Tooltip i Popover"
          description="Mikrointerakcje wspierające odkrywanie funkcji i operacje kontekstowe."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Tooltip w tabeli wyników</CardTitle>
                <CardDescription>Dodatkowe wyjaśnienie pojawia się przy hooverze lub fokusem klawiatury.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <span className="font-medium text-foreground">ROI kampanii:</span>
                  <Tooltip content="ROI wyliczamy jako (Przychód - Koszt) / Koszt w ujęciu miesięcznym.">
                    <Button variant="secondary" size="sm">
                      142%
                    </Button>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <span className="font-medium text-foreground">Średni czas ukończenia:</span>
                  <Tooltip side="top" align="start" content="Średnia bazuje na ostatnich 90 dniach i uwzględnia tylko moduły ukończone w całości.">
                    <span className="inline-flex items-center rounded-md border border-dashed border-border px-2 py-1 text-xs text-muted-foreground">
                      4.5 h
                    </span>
                  </Tooltip>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tooltip zachowuje 150 ms opóźnienia, aby nie zasłaniać informacji podczas przypadkowych hoverów.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Popover akcji grupowych</CardTitle>
                <CardDescription>Przydatny w listach użytkowników – pozwala na szybkie wybory bez opuszczania widoku.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Popover
                  trigger={
                    <Button variant="outline" size="sm">
                      Zarządzaj uczestnikami
                    </Button>
                  }
                  title="Bulk actions"
                  description="Wybierz akcję, która zostanie zastosowana do zaznaczonych rekordów."
                >
                  <div className="space-y-2 text-sm">
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-blue-50 hover:text-blue-700"
                      onClick={() =>
                        showToast({
                          title: 'Przypomnienie wysłane',
                          description: 'Powiadomienie e-mail trafi do 24 uczestników.',
                          variant: 'success',
                        })
                      }
                    >
                      Wyślij przypomnienie
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-blue-50 hover:text-blue-700"
                      onClick={() =>
                        showToast({
                          title: 'Udostępniono certyfikat',
                          description: 'Certyfikaty zostaną wygenerowane po zatwierdzeniu prowadzącego.',
                          variant: 'info',
                        })
                      }
                    >
                      Udostępnij certyfikat
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-rose-600 transition hover:bg-rose-50"
                      onClick={() =>
                        showToast({
                          title: 'Uwaga',
                          description: 'Cofnięcie dostępu usuwa użytkownika ze wszystkich grup.',
                          variant: 'warning',
                        })
                      }
                    >
                      Cofnij dostęp
                    </button>
                  </div>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Popover zamyka się po kliknięciu poza panel lub naciśnięciu ESC – nie blokuje kontekstu strony.
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Badges i statusy"
          description="Informują o stanie zasobu, nadają priorytet komunikatom i pomagają filtrować listy."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Warianty Badge</CardTitle>
                <CardDescription>Ton i wariant dostosowany do kontekstu – uporządkuj etykiety statusów.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {badgeVariantShowcase.map((badge) => (
                  <Badge
                    key={`${badge.label}-${badge.variant}`}
                    tone={badge.tone}
                    variant={badge.variant}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>StatusTag</CardTitle>
                <CardDescription>Szybkie oznaczenie stanu kursu, użytkownika lub procesu.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {statusTagShowcase.map((status) => (
                  <div key={status.status} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
                    <span>{status.label}</span>
                    <StatusTag status={status.status} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Wskaźniki postępu"
          description="Wizualizują stan trwających procesów – od ukończenia kursu po synchronizację danych."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Progress bar</CardTitle>
                <CardDescription>Liniowy komponent z możliwością pasków ostrzegawczych i wariantem paskowanym.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressBar
                  label="Ukończenie kursu"
                  value={courseProgress}
                  showValue
                />
                <ProgressBar
                  label="Synchronizacja materiałów"
                  value={syncProgress}
                  striped
                  showValue
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setCourseProgress((prev) => (prev + 18 > 100 ? 0 : prev + 18));
                      setSyncProgress((prev) => (prev + 12 > 100 ? 16 : prev + 12));
                    }}
                  >
                    Symuluj postęp
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Progress circle</CardTitle>
                <CardDescription>Wariant kołowy — idealny do prezentacji KPI i wyników indywidualnych.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-6">
                <ProgressCircle value={courseProgress} label="Wynik testu" />
                <ProgressCircle value={syncProgress} label="Upload zasobów" />
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Avatar"
          description="Zdjęcie lub inicjały z opcjonalnym statusem obecności – wykorzystywany w listach użytkowników."
        >
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Zespół trenerów</CardTitle>
              <CardDescription>Avatary wspierają różne rozmiary, kształty i wskaźniki statusu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {avatarShowcase.map((profile) => (
                <div key={profile.name} className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
                  <Avatar
                    name={profile.name}
                    src={profile.src || undefined}
                    size="md"
                    status={profile.status}
                    alt={profile.name}
                    initialsFallback={profile.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  />
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-slate-800">{profile.name}</span>
                    <span className="text-xs text-muted-foreground">{profile.role}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Section>

        <Section
          title="Toast (Powiadomienia)"
          description="Lekkie komunikaty pojawiają się w prawym dolnym rogu – informują o stanie akcji bez blokowania interfejsu."
        >
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Scenariusze powiadomień</CardTitle>
              <CardDescription>Toast wspiera warianty sukcesu, informacji, ostrzeżenia i błędu. Każdy posiada ikonę i kolor tła.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  onClick={() =>
                    showToast({
                      title: 'Kurs zapisany',
                      description: 'Zmiany zostały zapisane i są widoczne dla instruktorów.',
                      variant: 'success',
                    })
                  }
                >
                  Sukces
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    showToast({
                      title: 'Przetwarzamy raport',
                      description: 'Proces potrwa około 2 minut. Powiadomimy Cię e-mailem.',
                      variant: 'info',
                    })
                  }
                >
                  Informacja
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    showToast({
                      title: 'Limit miejsc bliski wyczerpania',
                      description: 'Pozostało 5 miejsc na warsztaty. Rozważ zwiększenie limitu.',
                      variant: 'warning',
                    })
                  }
                >
                  Ostrzeżenie
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    showToast({
                      title: 'Błąd zapisu',
                      description: 'Nie udało się zapisać zmian. Spróbuj ponownie lub skontaktuj się z supportem.',
                      variant: 'error',
                    })
                  }
                >
                  Błąd
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Domyślny timeout to 4 s, a użytkownik może ręcznie zamknąć toast. Provider obsługuje wiele notifów jednocześnie.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="Mega menu"
          description="Rozszerzona nawigacja prezentująca kluczowe sekcje produktu w panelu rozwijanym."
        >
          <div className="rounded-2xl border border-border bg-card p-6">
            <MegaMenu
              triggerLabel="Nawigacja"
              description="Poznaj najważniejsze moduły EduPlatform – od pulpitu po integracje i ustawienia uprawnień."
              columns={megaMenuColumns}
              cta={{ label: 'Przejdź do dokumentacji', href: '/docs' }}
            />
          </div>
        </Section>

        <Section
          title="Menu kontekstowe"
          description="Szybkie akcje dostępne po kliknięciu prawym przyciskiem – np. na elementach listy."
        >
          <div className="rounded-2xl border border-border bg-card p-6">
            <ContextMenu items={contextMenuItems}>
              <div className="rounded-xl border border-border bg-muted/50 p-6 text-sm text-muted-foreground">
                Kliknij prawym przyciskiem, aby zobaczyć menu akcji dla raportu miesięcznego.
              </div>
            </ContextMenu>
          </div>
        </Section>

        <Section
          title="Split Button"
          description="Przycisk z akcją główną oraz dodatkowymi opcjami w rozwijanym menu."
        >
          <div className="rounded-2xl border border-border bg-card p-6">
            <SplitButton
              label="Dodaj zasób"
              onPrimaryAction={() =>
                showToast({
                  title: 'Dodano zasób',
                  description: 'Utworzono podstawowy szkielet nowego kursu.',
                  variant: 'success',
                })
              }
              options={splitButtonItems}
            />
          </div>
        </Section>

        <Section
          title="Linki tekstowe"
          description="Komponent TextLink zapewnia spójne style inline, warianty kolorystyczne i pierścień focus do nawigacji klawiaturą."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Warianty kolorystyczne</CardTitle>
                <CardDescription>Domyślny niebieski, subtelny szary oraz wariant do ciemnych tł na CTA.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground">
                <p>
                  <TextLink href="#default">Domyślny link</TextLink> reaguje na hover i focus zgodnie z brand kolorami.
                </p>
                <p>
                  <TextLink href="#subtle" variant="subtle">
                    Subtelny link
                  </TextLink>{' '}
                  pasuje do treści w sekcjach informacyjnych.
                </p>
                <div className="rounded-lg bg-slate-900 p-4 text-slate-100">
                  <TextLink href="#inverse" variant="inverse">
                    Link na ciemnym tle
                  </TextLink>{' '}
                  zachowuje wysoki kontrast.
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Styl podkreślenia i linki zewnętrzne</CardTitle>
                <CardDescription>Możemy sterować podkreśleniem oraz automatycznie oznaczać linki zewnętrzne.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-foreground">
                <p>
                  <TextLink href="#always-underline" underline="always">
                    Zawsze podkreślony link
                  </TextLink>{' '}
                  sprawdza się w treściach dokumentacyjnych.
                </p>
                <p>
                  <TextLink href="#no-underline" underline="none">
                    Link bez podkreślenia
                  </TextLink>{' '}
                  bazuje na kolorze i focus outline.
                </p>
                <p>
                  <TextLink
                    href="https://eduplatform.io"
                    external
                    underline="always"
                  >
                    Zewnętrzny link z target=&quot;_blank&quot;
                  </TextLink>
                  . Wariant `external` automatycznie ustawia rel=&quot;noopener noreferrer&quot;.
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Chips i aktywne filtry"
          description="Pigułki stosowane do wyboru kategorii i prezentacji aktywnych filtrów."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Wybór kategorii</CardTitle>
                <CardDescription>Chipy wspierają tryb wielokrotnego wyboru i podświetlenie aktywnych opcji.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {['Design', 'UX', 'AI', 'Frontend', 'Analityka'].map((chip) => (
                  <Chip
                    key={chip}
                    onClick={() => toggleChip(chip)}
                    selected={selectedChips.includes(chip)}
                  >
                    {chip}
                  </Chip>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Aktywne filtry</CardTitle>
                <CardDescription>Kliknięcie krzyżyka usuwa filtr i aktualizuje zapytanie.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {activeFilters.length > 0 ? (
                  activeFilters.map((filter) => (
                    <FilterPill
                      key={filter.label}
                      label={filter.label}
                      count={filter.count}
                      onRemove={() => removeFilter(filter.label)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Brak aktywnych filtrów. Wybierz chip, aby zastosować filtrację.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title='Lista z przyciskiem "Załaduj więcej"'
          description="Pozwala odsłaniać kolejne porcje wyników bez paginacji."
        >
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Lista kursów</CardTitle>
              <CardDescription>Pierwsze trzy elementy są widoczne, kolejne pojawiają się po kliknięciu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-foreground">
                {demoCourses.slice(0, visibleCoursesCount).map((course) => (
                  <li key={course.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2">
                    <span className="font-medium">{course.title}</span>
                    <span className="text-xs text-muted-foreground">{course.category}</span>
                  </li>
                ))}
              </ul>
              {visibleCoursesCount < demoCourses.length ? (
                <LoadMoreButton
                  loading={loadingMore}
                  onClick={handleLoadMore}
                >
                  Załaduj więcej kursów
                </LoadMoreButton>
              ) : (
                <p className="text-xs text-muted-foreground">Wyświetlono wszystkie kursy demo.</p>
              )}
            </CardContent>
          </Card>
        </Section>

        <Section
          title="Komunikaty inline"
          description="Mini komponenty do przekazywania informacji pod polami formularza oraz w treści."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Warianty statusów</CardTitle>
                <CardDescription>Spójne kolory i ikony dla statusów info, success, warning oraz error.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <InlineMessage variant="info">
                  Info: aplikacja zapisze ustawienia automatycznie co 30 sekund.
                </InlineMessage>
                <InlineMessage variant="success">
                  Sukces: użytkownik został dodany do zespołu.
                </InlineMessage>
                <InlineMessage variant="warning">
                  Ostrzeżenie: limit licencji jest bliski wyczerpania.
                </InlineMessage>
                <InlineMessage variant="error">
                  Błąd: nie udało się połączyć z API. Spróbuj ponownie.
                </InlineMessage>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Helper tekst dla pól</CardTitle>
                <CardDescription>Wariant `helper` używany w komponentach formularza.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <InlineMessage variant="helper">
                  Helper: wprowadź co najmniej 8 znaków, w tym cyfrę i znak specjalny.
                </InlineMessage>
                <InlineMessage withIcon={false}>
                  Wariant bez ikony – tekst dopasowuje się do kontekstu.
                </InlineMessage>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Alerty globalne"
          description="Komponent AlertBanner służy do wyświetlania informacji systemowych w górnej części layoutu."
        >
          <div className="space-y-4">
            <AlertBanner
              variant="info"
              title="Nowa aktualizacja systemu"
              description="Wprowadziliśmy nowe role użytkowników oraz możliwość generowania raportów miesięcznych."
            />
            <AlertBanner
              variant="success"
              title="Plan premium aktywny"
              description="Twoja subskrypcja została przedłużona do 12.2025."
            />
            <AlertBanner
              variant="warning"
              title="Przypomnienie o danych rozliczeniowych"
              description="Zaktualizuj NIP oraz adres fakturowania, aby uniknąć przerwy w płatnościach."
            />
            {isStatusAlertVisible ? (
              <AlertBanner
                variant="error"
                title="Problem z dostępem do API"
                description="Usługa raportowa zwraca błąd 503. Pracujemy nad przywróceniem działania."
                onDismiss={() => setIsStatusAlertVisible(false)}
              />
            ) : (
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-slate-100"
                onClick={() => setIsStatusAlertVisible(true)}
              >
                Pokaż alert krytyczny ponownie
              </Button>
            )}
          </div>
        </Section>

        <Section
          title="Breadcrumbs"
          description="Pokazuje pozycję użytkownika w strukturze nawigacji i umożliwia szybki powrót do poprzednich poziomów."
        >
          <div className="space-y-4">
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/admin/dashboard' },
                { label: 'Kursy', href: '/admin/courses' },
                { label: 'React dla zespołów' },
              ]}
            />
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Billing', href: '/account/billing' },
                { label: 'History' },
              ]}
              separator={<span className="text-slate-300">/</span>}
            />
          </div>
        </Section>

        <Section
          title="Paginacja"
          description="Komponent nawigacji paginacyjnej z obsługą skróconych zakresów i dezaktywowanymi przyciskami."
        >
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Paginacja zasobów</CardTitle>
              <CardDescription>Zintegrowana z listami i tabelami; wspiera przełączanie stron oraz skracanie zakresu.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Wyniki  {(paginationPage - 1) * 10 + 1} – {Math.min(paginationPage * 10, 120)}  z  120</span>
                <Pagination
                  page={paginationPage}
                  pageCount={12}
                  showEdges
                  onPageChange={(page) => setPaginationPage(page)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Skrajne strony są zawsze widoczne, a brakujące zakresy zastępuje wielokropek. Wejścia <code>disabled</code> zdejmuje interakcję z przyciskami Poprzednia/Następna.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="Footer"
          description="Sekcja kończąca stronę z nawigacją, informacjami prawnymi i logotypem."
        >
          <Footer
            className="rounded-2xl border border-border"
            sections={[
              {
                title: 'Produkt',
                links: [
                  { label: 'Funkcje', href: '/#features' },
                  { label: 'Cennik', href: '/#pricing' },
                  { label: 'Status usługi', href: '/status' },
                ],
              },
              {
                title: 'Zasoby',
                links: [
                  { label: 'Dokumentacja', href: '/docs' },
                  { label: 'Centrum pomocy', href: '/support' },
                  { label: 'Blog', href: '/blog' },
                ],
              },
              {
                title: 'Firma',
                links: [
                  { label: 'O nas', href: '/about' },
                  { label: 'Kariera', href: '/career' },
                  { label: 'Kontakt', href: '/contact' },
                ],
              },
            ]}
            logo={<span className="text-lg font-semibold">EduPlatform</span>}
            description="Dostarczamy kompleksową platformę do zarządzania edukacją i rozwojem kompetencji w organizacjach."
          />
        </Section>

        <Section
          title="Komponenty administracyjne"
          description="Elementy wykorzystywane w panelu admina. Prezentujemy je na przykładowych danych."
        >
          <div className="space-y-12">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Dashboard widgets</CardTitle>
                <CardDescription>Szybkie metryki biznesowe w formie kart.</CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardWidgets stats={dashboardStats} />
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Data Table</CardTitle>
                <CardDescription>Komponent listy zasobów kompatybilny z akcjami wierszy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DataTable<DemoUser>
                  data={tableData}
                  columns={tableColumns}
                  title="Użytkownicy demo"
                  selectableRows
                  getRowId={(item) => item.id}
                  onSelectionChange={setSelectedUsers}
                  initialPageSize={5}
                  pageSizeOptions={[5, 10, 20]}
                  actions={[
                    {
                      name: 'Ping',
                      handler: (item) =>
                        showToast({
                          title: 'Test ping',
                          description: `Wysłano przypomnienie do ${item.name}`,
                          variant: 'info',
                        }),
                    },
                    {
                      name: 'Usuń',
                      handler: (item) =>
                        showToast({
                          title: 'Symulacja usunięcia',
                          description: `${item.name} zostałby oznaczony jako usunięty.`,
                          variant: 'warning',
                          action: {
                            label: 'Cofnij',
                            onClick: (toastId) => {
                              showToast({
                                id: toastId,
                                title: 'Cofnięto operację',
                                description: `${item.name} pozostaje aktywny`,
                                variant: 'success',
                              });
                            },
                          },
                        }),
                    },
                  ]}
                  onSearch={(term) =>
                    showToast({
                      title: 'Filtrowanie tabeli',
                      description: `Szukasz: ${term}`,
                      variant: 'info',
                    })
                  }
                  searchPlaceholder="Wyszukaj użytkownika..."
                  onAdd={() => setIsModalOpen(true)}
                  onExport={() =>
                    showToast({
                      title: 'Eksport danych',
                      description: 'Przygotowano plik CSV do pobrania.',
                      variant: 'success',
                    })
                  }
                />
                <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-muted-foreground">
                  <p>
                    Struktura danych: <strong>{Object.keys(tableData[0]).join(', ')}</strong>.
                    Rola → liczba rekordów: {Object.entries(summarizedRoles).map(([role, count]) => `${role} (${count})`).join(', ')}.
                  </p>
                  <p className="mt-2 text-xs">
                    Zaznaczeni użytkownicy: {selectedUsers.length > 0 ? selectedUsers.map((user) => user.name).join(', ') : 'brak'}.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Admin Form</CardTitle>
                <CardDescription>Dynamiczny formularz CRUD z walidacją wymagalnych pól.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-2">
                <AdminForm
                  fields={formFields}
                  title="Dodaj członka zespołu"
                  onSubmit={(data) => {
                    setFormState(data);
                    showToast({
                      title: 'Formularz wysłany',
                      description: `${data.name} zapisany jako ${data.role}.`,
                      variant: 'success',
                    });
                  }}
                  submitButtonText="Zapisz użytkownika"
                />
                <div className="space-y-4 rounded-xl border border-dashed border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground">Podgląd odpowiedzi</h3>
                  <p className="text-sm text-muted-foreground">
                    W brandbooku dane zapisywane są lokalnie, żeby pokazać strukturę obiektu wysyłanego do API.
                  </p>
                  <pre className="overflow-auto rounded-lg bg-slate-900 px-4 py-3 text-xs text-slate-100">
                    {JSON.stringify(formState ?? { status: 'Czekamy na przesłanie formularza...' }, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Finance Charts</CardTitle>
                <CardDescription>Komponenty wizualizacji korzystające z Recharts.</CardDescription>
              </CardHeader>
              <CardContent>
                <FinanceCharts revenueData={revenueData} />
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Kalendarz / Agenda dnia</CardTitle>
                <CardDescription>
                  Zaawansowany kalendarz w stylu Outlooka z funkcjami drag & drop, resize, edycją przez modal, wykrywaniem konfliktów i filtrami kategorii.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Calendar
                  events={calendarEvents}
                  onSlotCreate={handleCalendarSlotCreate}
                  onEventClick={handleCalendarEventClick}
                  onEventUpdate={handleCalendarEventUpdate}
                  onEventDelete={handleCalendarEventDelete}
                  onEventDuplicate={handleCalendarEventDuplicate}
                  showConflicts={true}
                  allowOverlap={true}
                  onViewChange={(mode) =>
                    showToast({
                      title: 'Zmieniono widok',
                      description: mode === 'month' ? 'Widok miesiąca' : mode === 'week' ? 'Widok tygodnia' : 'Widok dnia',
                      variant: 'info',
                    })
                  }
                  onDateChange={(date) =>
                    showToast({
                      title: 'Nowy zakres dat',
                      description: date.toLocaleDateString(),
                      variant: 'info',
                    })
                  }
                />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">🎯 Scenariusze testowe:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li><strong>Drag & Drop:</strong> Przeciągnij wydarzenie na inny dzień lub godzinę</li>
                    <li><strong>Resize:</strong> Najedź na krawędź wydarzenia i przeciągnij, aby zmienić czas trwania</li>
                    <li><strong>Context Menu:</strong> Kliknij prawym przyciskiem na wydarzenie → Edytuj / Duplikuj / Usuń</li>
                    <li><strong>Widok miesiąca:</strong> Przełącz na widok "Miesiąc" i kliknij 2x na dzień, aby przejść do widoku dnia</li>
                    <li><strong>Konflikt:</strong> Spróbuj stworzyć nakładające się wydarzenia (czerwona ikona ostrzeżenia)</li>
                    <li><strong>Filtry:</strong> Kliknij kategorię aby filtrować wydarzenia (Spotkanie, Warsztat, Demo, Prywatne)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          title="Modal i toast – interakcje"
          description="Rozszerzone kontrolki do potwierdzeń oraz mikropowiadomień z akcjami."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Modal</CardTitle>
                <CardDescription>Obsługuje rozmiary, sekcję stopki, blokadę zamknięcia oraz stany ładowania.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Idealny do krytycznych potwierdzeń – można zablokować zamknięcie do czasu zakończenia zapisu, dodać własny opis w stopce i akcje z ikonami.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                      setModalLoading(false);
                      setIsModalOpen(true);
                    }}
                  >
                    Pokaż modal potwierdzenia
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setModalLoading(true);
                      setIsModalOpen(true);
                    }}
                  >
                    Pokaż modal z loaderem
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Toast</CardTitle>
                <CardDescription>Warianty z akcjami (np. Undo) i własnym czasem życia.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Provider obsługuje kolejkę, akcje pomocnicze oraz możliwość ustawienia `duration=null`, by utrzymać komunikat do zamknięcia przez użytkownika.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() =>
                      showToast({
                        title: 'Udało się!',
                        description: 'Twoja konfiguracja została zapisana.',
                        variant: 'success',
                      })
                    }
                  >
                    Sukces
                  </Button>
                  <Button
                    className="bg-amber-500 text-white hover:bg-amber-600"
                    onClick={() =>
                      showToast({
                        title: 'Ostrzeżenie',
                        description: 'Sprawdź limit przyznanych licencji.',
                        variant: 'warning',
                      })
                    }
                  >
                    Ostrzeżenie
                  </Button>
                  <Button
                    className="bg-rose-500 text-white hover:bg-rose-600"
                    onClick={() =>
                      showToast({
                        title: 'Błąd',
                        description: 'Nie udało się połączyć z serwerem API.',
                        variant: 'error',
                      })
                    }
                  >
                    Błąd
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      showToast({
                        title: 'Wysłano raport',
                        description: 'Masz 10 sekund na cofnięcie wysyłki.',
                        variant: 'info',
                        duration: 10000,
                        action: {
                          label: 'Cofnij',
                          onClick: () =>
                            showToast({
                              title: 'Cofnięto operację',
                              description: 'Raport wrócił do szkiców.',
                              variant: 'success',
                            }),
                        },
                      })
                    }
                  >
                    Toast z akcją
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => !modalLoading && setIsModalOpen(false)}
        title="Potwierdź akcję"
        description="To demo modala – wykorzystaj je do blokowania krytycznych operacji, takich jak usunięcie kursu."
        size="lg"
        loading={modalLoading}
        preventCloseOnOverlay={modalLoading}
        preventCloseOnEsc={modalLoading}
        footerContent={<span className="text-xs text-muted-foreground">Akcje zatwierdzeń są logowane w dzienniku audytowym.</span>}
        actions={[
          {
            label: 'Anuluj',
            variant: 'secondary',
            onClick: () => setModalLoading(false),
            dismiss: true,
          },
          {
            label: modalLoading ? 'Przetwarzanie…' : 'Potwierdź',
            icon: <Send className="h-4 w-4" />,
            onClick: handleModalConfirm,
            loading: modalLoading,
          },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          Upewnij się, że użytkownik rozumie konsekwencje. W treści modal dodaj kluczowe szczegóły operacji lub dane
          kontekstowe.
        </p>
      </Modal>
    </div>
  );
}
