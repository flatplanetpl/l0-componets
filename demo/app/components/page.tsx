import fs from 'fs';
import path from 'path';

type ControlDefinition = {
  name: string;
  path: string;
  description: string;
  usageExample?: string;
};

type ControlCategory = {
  category: string;
  items: ControlDefinition[];
};

const controlCatalog: ControlCategory[] = [
  {
    category: 'Warstwa marketingowa',
    items: [
      {
        name: 'Navigation',
        path: 'components/general/Navigation.tsx',
        description: 'Górny pasek nawigacji strony publicznej z CTA do logowania.',
      },
      {
        name: 'Hero',
        path: 'components/general/Hero.tsx',
        description: 'Sekcja hero z nagłówkiem, przyciskami i ilustracją.',
      },
      {
        name: 'Stats',
        path: 'components/general/Stats.tsx',
        description: 'Blok z kluczowymi metrykami platformy (liczba kursów, studentów).',
      },
      {
        name: 'Features',
        path: 'components/general/Features.tsx',
        description: 'Grid funkcjonalności z ikonami emoji i krótkimi opisami.',
      },
      {
        name: 'TestimonialSlider',
        path: 'components/general/TestimonialSlider.tsx',
        description: 'Karuzela opinii użytkowników z ocenami i opisami.',
      },
      {
        name: 'CourseCard',
        path: 'components/general/CourseCard.tsx',
        description: 'Karta kursu używana w sekcji popularnych kursów.',
      },
      {
        name: 'CTA',
        path: 'components/general/CTA.tsx',
        description: 'Sekcja call-to-action z dwoma przyciskami akcji.',
      },
    ],
  },
  {
    category: 'Panel administracyjny',
    items: [
      {
        name: 'Sidebar',
        path: 'components/Sidebar.tsx',
        description: 'Menu boczne panelu admina z ikonami i linkami do sekcji.',
      },
      {
        name: 'DashboardWidgets',
        path: 'components/admin/DashboardWidgets.tsx',
        description: 'Zestaw kart statystyk i widgetów na pulpicie administratora.',
      },
      {
        name: 'DataTable',
        path: 'components/admin/DataTable.tsx',
        description: 'Tabela danych z akcjami wierszy, wyszukiwarką i przyciskiem dodawania.',
      },
      {
        name: 'AdminForm',
        path: 'components/admin/AdminForm.tsx',
        description: 'Dynamiczny formularz CRUD generowany na podstawie konfiguracji zasobu.',
      },
      {
        name: 'ResourceListPage',
        path: 'components/admin/pages/ResourceListPage.tsx',
        description: 'Widok listy zasobów (użytkownicy, kursy) oparty o DataTable oraz AdminForm.',
      },
      {
        name: 'DashboardPage',
        path: 'components/admin/pages/DashboardPage.tsx',
        description: 'Kontener dla widoku dashboardu z wykresami i aktywnościami.',
      },
      {
        name: 'FinanceCharts',
        path: 'components/FinanceCharts.tsx',
        description: 'Wykresy finansowe korzystające z biblioteki Recharts.',
      },
      {
        name: 'RecentActivity',
        path: 'components/RecentActivity.tsx',
        description: 'Lista ostatnich aktywności administracyjnych wyświetlana na dashboardzie.',
      },
      {
        name: 'UserChart',
        path: 'components/UserChart.tsx',
        description: 'Wykres aktywności użytkowników w czasie.',
      },
      {
        name: 'UserPermissions',
        path: 'components/UserPermissions.tsx',
        description: 'Kontrolka edycji uprawnień i ról dla pojedynczego użytkownika.',
      },
      {
        name: 'UserProfile',
        path: 'components/UserProfile.tsx',
        description: 'Karta profilu użytkownika z danymi osobowymi.',
      },
    ],
  },
  {
    category: 'Warstwa dostępu i infrastruktura',
    items: [
      {
        name: 'AuthProvider',
        path: 'components/AuthProvider.tsx',
        description: 'Dostawca kontekstu NextAuth do ochrony tras klienckich.',
      },
      {
        name: 'ProtectedRoute',
        path: 'components/ProtectedRoute.tsx',
        description: 'HOC zabezpieczający trasy panelu admina przed anonimowym dostępem.',
      },
    ],
  },
  {
    category: 'UI Primitives',
    items: [
      {
        name: 'Button',
        path: 'components/ui/button.tsx',
        description: 'Komponent przycisku z wariantami stylów spójnymi z Tailwind.',
      },
      {
        name: 'Card',
        path: 'components/ui/card.tsx',
        description: 'Podstawowy kontener z nagłówkiem i sekcją treści.',
      },
      {
        name: 'Icon registry',
        path: 'components/ui/icons.tsx',
        description: 'Mapa nazw ikon do komponentów lucide-react ujednolicająca importy.',
      },
      {
        name: 'Modal',
        path: 'components/ui/modal.tsx',
        description: 'Modal z obsługą portalu, zamykania klawiszem Escape oraz akcjami w stopce.',
        usageExample:
          "<Modal open={open} onClose={handleClose} title=\"Usuń kurs\" primaryAction={{ label: 'Potwierdź', onClick: submit }}>",
      },
      {
        name: 'Toast',
        path: 'components/ui/toast.tsx',
        description: 'ToastProvider z hookiem useToast i wariantami (default, success, error, info).',
        usageExample:
          "const { showToast } = useToast(); showToast({ title: 'Zapisano', variant: 'success' });",
      },
    ],
  },
];

const baseDir = process.cwd();

const resolvedCatalog = controlCatalog.map((category) => ({
  ...category,
  items: category.items.map((item) => {
    const absolutePath = path.join(baseDir, item.path);
    const exists = fs.existsSync(absolutePath);
    return { ...item, exists };
  }),
}));

const missingControls = resolvedCatalog
  .flatMap((category) => category.items)
  .filter((item) => !item.exists);

export default function ComponentsOverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-foreground">Przegląd kontrolek</h1>
        <p className="text-muted-foreground transition-colors dark:text-slate-400">
          Poniższa lista zestawia wszystkie dostępne komponenty UI w aplikacji oraz
          wskazuje kontrolki do zaplanowania. Sekcje są pogrupowane według obszaru użycia.
        </p>
      </header>

      {resolvedCatalog.map((category) => {
        const availableControls = category.items.filter((item) => item.exists);

        return (
          <section key={category.category} className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground transition-colors dark:text-slate-100">{category.category}</h2>
              <p className="text-sm text-muted-foreground transition-colors dark:text-slate-400">
                {availableControls.length > 0
                  ? `Zidentyfikowane kontrolki: ${availableControls.length}`
                  : 'Brak wdrożonych kontrolek w tej kategorii.'}
              </p>
            </div>
            {availableControls.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {availableControls.map((control) => (
                  <article
                    key={control.name}
                    className="rounded-xl border border-slate-200 bg-card p-5 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900"
                  >
                  <h3 className="text-lg font-medium text-foreground transition-colors dark:text-slate-100">{control.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground transition-colors dark:text-slate-400">{control.description}</p>
                  {control.usageExample && (
                    <pre className="mt-4 rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-100">
                      {control.usageExample}
                    </pre>
                  )}
                  <p className="mt-4 text-xs font-mono text-blue-600 dark:text-blue-400">{control.path}</p>
                </article>
              ))}
            </div>
            )}
          </section>
        );
      })}

      <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 transition-colors dark:border-amber-400 dark:bg-amber-500/10">
        <div>
          <h2 className="text-2xl font-semibold text-amber-900 dark:text-amber-200">Brakujące kontrolki</h2>
          <p className="text-sm text-amber-700 dark:text-amber-200/80">
            Lista elementów, które warto dodać, aby uzupełnić bibliotekę UI oraz procesy
            administracyjne.
          </p>
        </div>
        {missingControls.length === 0 ? (
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Wszystkie kontrolki z katalogu są dostępne – na tę chwilę brak brakujących elementów.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {missingControls.map((control) => (
              <article
                key={control.name}
                className="rounded-xl border border-dashed border-amber-300 bg-card p-5 shadow-sm transition-colors dark:border-amber-400 dark:bg-slate-900"
              >
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">{control.name}</h3>
                <p className="mt-2 text-sm text-amber-700 dark:text-amber-200/80">{control.description}</p>
                <p className="mt-4 text-xs font-mono text-amber-600 dark:text-amber-300">
                  Oczekiwany plik: {control.path}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
