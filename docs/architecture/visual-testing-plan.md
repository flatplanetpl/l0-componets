# 🎯 Visual Testing Plan

Ten plan opisuje docelową strategię testów wizualnych dla aplikacji demo (brandbook + widoki administracyjne).

## 1. Narzędzia i konfiguracja

- **Playwright** – już skonfigurowany w `demo/playwright.config.ts` (Chromium).
- **Screenshots baseline** – przechowujemy w repozytorium (`demo/tests/e2e/__screenshots__/` – do utworzenia po pierwszym przebiegu).
- **Tryby kolorystyczne** – każdy scenariusz wykonujemy w motywie jasnym i ciemnym (patrz `brandbook.theme.spec.ts`).

## 2. Obecne scenariusze

| Scenariusz | Plik testu | Pokrycie |
|------------|------------|----------|
| Brandbook (jasny/ciemny) | `demo/tests/e2e/brandbook.theme.spec.ts` | Hero, sekcje komponentów |

## 3. Kolejne widoki do objęcia

1. `/components` – weryfikacja listy kontrolek (zadbaj o kontrast i layout w dark mode).
2. `/admin/dashboard` – podstawowe kafelki, widgety i „quick action”.
3. `/admin/courses` – tabela zasobów + akcje wierszy.
4. `/admin/users` – formularze CRUD + walidacja.

Każdy widok powinien mieć osobny test Playwright z:
- przełączeniem motywu (jasny/ciemny),
- screenshotem pełnej strony,
- ewentualnie dodatkowym screenshotem elementów dynamicznych (np. modale, menu kontekstowe).

## 4. Integracja w CI

- Docelowo włączamy `npm run test:e2e` w pipeline CI.
- Dla stabilnych porównań ustaw `CI=1`, aby Playwright zawsze gasił serwer.
- Warto rozważyć integrację z Percy/Chromatic dla automatycznej analizy diffów.

## 5. Konserwacja

- Po każdej zmianie UI zaktualizuj baseline (`npx playwright test --update-snapshots`).
- Różnice wizualne zawsze weryfikuj ręcznie przed akceptacją.

## 6. TODO

- [ ] Dodać scenariusze Playwright dla `/components`, `/admin/dashboard`, `/admin/courses`, `/admin/users`.
- [ ] Rozszerzyć testy o interakcje (np. otwarcie modala, rozwinięcie menu).
- [ ] Skonfigurować raport HTML w CI i dołączyć artefakty screenshotów do pipeline.

