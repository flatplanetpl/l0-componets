# CLAUDE.md

Ten plik zawiera wytyczne dla Claude Code (claude.ai/code) podczas pracy z kodem w tym repozytorium.

## Przegląd Projektu

To jest szablon full-stack aplikacji webowej składający się z trzech głównych komponentów:
1. **backend/**: API w NestJS z Prisma ORM, obsługą WebSocket i przesyłania plików
2. **demo/**: Panel administracyjny EduPlatform (Next.js 14 z App Router) - implementacja referencyjna
3. **frontend/**: Aplikacja Next.js 14 z uwierzytelnianiem i funkcjami czasu rzeczywistego

Architektura wykorzystuje wzorzec monorepo z niezależnymi serwisami frontend i backend, które komunikują się przez REST API i WebSocket.

## Polecenia Deweloperskie

### Instalacja i Konfiguracja
```bash
# Początkowa konfiguracja (instaluje wszystkie zależności, generuje klienta Prisma, aktualizuje schemat)
npm run setup

# Konfiguracja poszczególnych workspace'ów
npm run setup:frontend  # Instaluje zależności frontend
npm run setup:backend   # Instaluje zależności backend + uruchamia Prisma generate & db push
npm run setup:demo      # Instaluje zależności demo
```

### Uruchamianie Aplikacji
```bash
# Pełny stack Docker Compose (zalecane)
npm run dev

# Poszczególne serwisy (do skupionego debugowania)
npm run dev:backend   # Uruchamia NestJS na porcie 3001
npm run dev:frontend  # Uruchamia frontend Next.js na porcie 3000 (skonfigurowany w frontend/)
npm run dev:demo      # Uruchamia demo Next.js na porcie 3000 (skonfigurowany w demo/)
```

### Budowanie
```bash
# Buduj wszystkie workspace'y
npm run build

# Budowanie poszczególnych
npm run build:frontend
npm run build:backend
npm run build:demo
```

### Testowanie
```bash
# Uruchom wszystkie testy (frontend Jest + backend Jest + demo Playwright)
npm test

# Testy backendu
cd backend
npm test              # Uruchom testy jednostkowe
npm run test:watch    # Tryb watch
npm run test:cov      # Z pokryciem kodu (cel ≥80%)
npm run test:e2e      # Testy end-to-end

# Testy frontendu
cd frontend
npm test              # Uruchom testy Jest
npm run test:watch    # Tryb watch

# Testy demo
cd demo
npm run test:e2e         # Uruchom testy E2E Playwright
npm run test:e2e:ui      # Tryb UI Playwright
npm run test:e2e:headed  # Uruchom z widoczną przeglądarką
```

### Lintowanie i Formatowanie
```bash
# Backend
cd backend
npm run lint    # ESLint z automatycznymi poprawkami
npm run format  # Formatowanie Prettier

# Frontend/Demo
cd frontend  # lub cd demo
npm run lint    # Lint Next.js
```

## Architektura i Kluczowe Wzorce

### Backend (NestJS + Prisma)
- **Struktura modułów**: Funkcje zorganizowane jako moduły NestJS (`*.module.ts`, `*.service.ts`, `*.controller.ts`)
- **Baza danych**: Prisma ORM z SQLite (dev) - schemat w `backend/prisma/schema.prisma`
  - **Model User**: Integracja z Google OAuth przez `googleId`, przechowuje profil użytkownika i awatar
  - **Model File**: Powiązany z User, śledzi przesłane pliki z metadanymi (mimetype, size, path)
- **Uwierzytelnianie**:
  - Strategie Passport.js: Google OAuth 2.0 (`backend/src/auth/google.strategy.ts`) i JWT (`backend/src/auth/jwt.strategy.ts`)
  - Tokeny JWT dla bezstanowego uwierzytelniania między frontendem a backendem
  - Struktura modułu Auth w `backend/src/auth/`
- **WebSocket**: Gateway Socket.io w `backend/src/websocket/` dla funkcji czasu rzeczywistego
- **Przesyłanie plików**: System oparty na Multer w `backend/src/upload/` - pliki przechowywane w `/uploads`
- **Serwis Bazy Danych**: Scentralizowany klient Prisma w `backend/src/prisma/prisma.service.ts`

Po modyfikacji `prisma/schema.prisma` zawsze uruchom:
```bash
cd backend
npx prisma generate  # Regeneruj Prisma Client
npx prisma db push   # Prześlij zmiany schematu do bazy danych
```

### Frontend i Demo (Next.js 14)
- **App Router**: Używa Next.js 14 App Router (nie Pages Router)
- **Uwierzytelnianie**: NextAuth.js z dostawcą Google OAuth
  - Trasy API w `demo/app/api/auth/[...nextauth]/route.ts`
  - Zarządzanie sesją i callbacki auth skonfigurowane dla JWT
  - Dostęp oparty na rolach: User, Operator, Admin (RBAC)
- **Stylowanie**: Tailwind CSS z biblioteką komponentów shadcn/ui
- **Komponenty**:
  - `demo/components/ui/`: Wielokrotnego użytku prymitywy UI (przyciski, formularze, karty, itp.)
  - `demo/components/admin/`: Komponenty specyficzne dla admina
  - `demo/components/general/`: Komponenty ogólnego przeznaczenia
  - Komponenty główne: `Sidebar.tsx`, `DashboardStats.tsx`, `UserChart.tsx`, itp.
- **Czas rzeczywisty**: Klient Socket.io łączy się z gateway WebSocket backendu
- **Wizualizacja danych**: Biblioteka Recharts do wykresów i analityki

### Struktura Aplikacji Demo
Aplikacja demo (`demo/`) implementuje panel administracyjny EduPlatform z:
- **Trasami** (w `demo/app/`):
  - `/admin/dashboard` - Główny panel administracyjny ze statystykami i wykresami
  - `/admin/users` - Zarządzanie użytkownikami
  - `/admin/courses` - Zarządzanie kursami
  - `/admin/finance` - Raporty finansowe
  - `/admin/content` - Zarządzanie treścią
  - `/admin/reports` - Analityka i raportowanie
  - `/admin/analytics` - Zaawansowana analiza danych
  - `/admin/backup` - Funkcjonalność backup/restore
  - `/admin/monitoring` - Monitoring systemu
  - `/admin/settings` - Konfiguracja
- **Przepływ uwierzytelniania**: Chronione trasy używają wrappera `ProtectedRoute.tsx`
- **Uprawnienia**: `UserPermissions.tsx` obsługuje sprawdzanie RBAC

### Konfiguracja Docker
- `docker-compose.yml` orkiestruje: serwis backend, serwis demo, bazę danych
- Oba serwisy frontend (frontend i demo) działają na porcie 3000 wewnętrznie (mapowane zewnętrznie)
- Backend działa na porcie 3001
- Montowanie woluminów umożliwia hot reloading podczas developmentu
- Katalog `/uploads` jest montowany jako wolumen

## Konfiguracja Środowiska

### Wymagane Zmienne Środowiskowe

**demo/.env.local**:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<wygeneruj-przez-openssl-rand-base64-32>
GOOGLE_CLIENT_ID=<z-google-cloud-console>
GOOGLE_CLIENT_SECRET=<z-google-cloud-console>
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
ADMIN_EMAIL=admin@example.com
```

**backend/.env**:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=<zmień-w-produkcji>
GOOGLE_CLIENT_ID=<ten-sam-co-frontend>
GOOGLE_CLIENT_SECRET=<ten-sam-co-frontend>
```

### Konfiguracja Google OAuth
1. Google Cloud Console → Utwórz dane uwierzytelniające OAuth 2.0
2. Autoryzowany URI przekierowania: `http://localhost:3000/api/auth/callback/google`
3. Użyj tych samych `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` w frontendzie i backendzie

**Bezpieczeństwo**: Nigdy nie commituj prawdziwych danych uwierzytelniających. Używaj plików `.env.example` jako szablonów.

## Konwencje Kodu

### TypeScript
- Jawne typy zwracane dla eksportowanych funkcji i serwisów
- Włączone ścisłe sprawdzanie typów
- Wcięcia 2-spacjowe (wymuszane przez ESLint/Prettier)

### Nazewnictwo
- Komponenty: PascalCase (`UserCard.tsx`, `DashboardStats.tsx`)
- Hooki: camelCase z prefiksem `use` (`useDashboardData.ts`)
- Serwisy: camelCase (`auth.service.ts`)
- Backend: Konwencje NestJS (`*.module.ts`, `*.service.ts`, `*.controller.ts`)

### Organizacja Plików
- Backend: Moduły oparte na funkcjach w `backend/src/`
- Frontend/Demo: Strony App Router w `app/`, komponenty w `components/`
- Kolokacja kodu funkcji: Trzymaj razem powiązane komponenty, hooki i serwisy
- Testy: Testy jednostkowe jako `*.spec.ts` (backend) lub `*.test.tsx` (frontend); E2E jako `*.spec.ts` w `demo/tests/`

### Konwencje Commitów
- Używaj Conventional Commits: `feat(auth): add refresh tokens`, `fix(ui): button alignment`
- Prefiksy: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
- Squash commitów przed mergem

## Typowe Zadania Deweloperskie

### Dodawanie Nowego Modułu Backend
```bash
cd backend
nest generate module nazwa-funkcji
nest generate service nazwa-funkcji
nest generate controller nazwa-funkcji
```
Następnie zarejestruj moduł w importach `app.module.ts`.

### Dodawanie Nowego Modelu Prisma
1. Edytuj `backend/prisma/schema.prisma`
2. Uruchom `npx prisma generate` (aktualizuje Prisma Client)
3. Uruchom `npx prisma db push` (aktualizuje bazę danych)
4. Jeśli potrzebne dla produkcji, utwórz migrację: `npx prisma migrate dev --name opis`

### Dodawanie Chronionych Tras
Owiń komponenty stron Next.js w `ProtectedRoute`:
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      {/* zawartość strony */}
    </ProtectedRoute>
  );
}
```

### Praca z WebSocket
- Gateway backendu: `backend/src/websocket/websocket.gateway.ts`
- Klient frontendu: Połącz się używając klienta Socket.io z `NEXT_PUBLIC_WS_URL`
- Zdarzenia są emitowane z gateway i nasłuchiwane po stronie klienta

## Notatki o Bazie Danych Prisma

- Development używa SQLite (`backend/prisma/dev.db`) - wykluczony z gita
- Produkcja powinna używać PostgreSQL/MySQL (zaktualizuj `DATABASE_URL` i `provider`)
- Po zmianach schematu, regeneruj klienta: `npx prisma generate`
- Prześlij zmiany do DB: `npx prisma db push` (dev) lub `npx prisma migrate dev` (z migracjami)
- Klient Prisma jest singletonem, wstrzykiwanym przez `PrismaService`

## Ważne Pliki i Katalogi

- `backend/src/main.ts` - Punkt wejścia aplikacji NestJS, konfiguruje CORS, port
- `demo/app/layout.tsx` - Layout główny z AuthProvider i globalnymi stylami
- `demo/app/api/auth/[...nextauth]/route.ts` - Konfiguracja NextAuth.js
- `config.js` - Główna konfiguracja portów i URL (jeśli używasz pliku config)
- `docker-compose.yml` - Orkiestracja kontenerów
- `.dockerignore`, `.gitignore` - Wzorce wykluczania plików
- `uploads/` - Runtime przechowywania plików (wykluczony z gita, montowany w Dockerze)

## Strategia Testowania

- **Backend**: Testy jednostkowe Jest (`*.spec.ts`) dla serwisów/kontrolerów; testy E2E w `backend/test/`
- **Frontend**: Jest + React Testing Library dla testów komponentów
- **Demo**: Playwright dla testów end-to-end obejmujących uwierzytelnianie i przepływy admin
- Cel: ≥80% pokrycia dla serwisów backend
- Uruchom pełny zestaw testów (`npm test` z głównego katalogu) przed otwarciem PR

## Kontrola Dostępu Oparta na Rolach (RBAC)

System trójstopniowy zaimplementowany w aplikacji demo:
- **User**: Podstawowy dostęp do dashboardu
- **Operator**: Zarządzanie treścią i raporty
- **Admin**: Pełny dostęp administracyjny

Email admina konfigurowany przez zmienną środowiskową `ADMIN_EMAIL` w `demo/.env.local`.

## Dodatkowe Pliki z Wytycznymi

To repozytorium zawiera dodatkowe pliki kontekstowe dla innych asystentów AI:
- `AGENTS.md` - Wytyczne i konwencje kodowania w stylu Cursor/Copilot
- `QWEN.md` - Kompleksowy przegląd architektoniczny

Zapoznaj się z nimi dla bardziej szczegółowych wzorców kodowania i notatek bezpieczeństwa.
