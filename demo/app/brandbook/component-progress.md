# Brandbook Component Progress

## Bazowe komponenty
- [x] Przycisk (Button) — demo/components/ui/button.tsx — shadcn-based variants ready.
- [x] Link (Text Link) — frontend/src/components/ui/textLink.tsx (alias @frontend) + sekcja demo w brandbooku.
- [x] Pole tekstowe (Text Field/Input) — frontend/src/components/ui/formFields.tsx (używane w demo przez alias @frontend) — reusable TextField with full state handling.
- [x] Pole tekstowe wielowierszowe (Textarea) — frontend/src/components/ui/formFields.tsx — TextareaField extracted with shared styling.
- [x] Pole hasła (Password Field) — frontend/src/components/ui/formFields.tsx — PasswordField z przełącznikiem widoczności i stanami błędów.
- [x] Pole liczbowe (Number Input) — frontend/src/components/ui/formFields.tsx — NumberField z ujednoliconą walidacją i helperami.
- [x] Pole wyszukiwania (Search Field) — frontend/src/components/ui/choiceFields.tsx `SearchField`, używany w DataTable.
- [x] Lista rozwijana (Select / Dropdown) — frontend/src/components/ui/choiceFields.tsx `SelectField`.
- [x] Przełącznik dwustanowy (Checkbox) — frontend/src/components/ui/choiceFields.tsx `CheckboxField`.
- [x] Przełącznik on/off (Switch / Toggle) — frontend/src/components/ui/choiceFields.tsx `SwitchField`.
- [x] Przycisk radiowy (Radio Button) — frontend/src/components/ui/choiceFields.tsx `RadioGroupField`.
- [x] Przycisk ikona (Icon Button) — demo/components/ui/button.tsx — size='icon'.
- [x] Etykieta pola (Field Label) — dostarczana centralnie przez form fields wrapper (FormFieldShell).
- [x] Podpowiedź / pomoc (Helper Text) — `helperText` wspierane w nowych komponentach formularza.
- [x] Walidacja błędu (Error Message) — komponenty formularza renderują spójne komunikaty błędów.
- [x] Sukces/Info (Success/Info Message) — frontend/src/components/ui/inlineMessage.tsx prezentuje helper/info/success w brandbooku.
- [x] Paginacja (Pagination) — frontend/src/components/ui/pagination.tsx zademonstrowana w brandbooku.
- [x] Breadcrumbs (Breadcrumbs) — frontend/src/components/ui/breadcrumbs.tsx z przykładami w brandbooku.
- [x] Nawigacja górna (Top Nav / Navbar) — demo/components/general/Navigation.tsx
- [x] Stopka (Footer) — frontend/src/components/general/Footer.tsx + sekcja w brandbooku.

## Elementy układu i treści
- [x] Karta (Card) — demo/components/ui/card.tsx
- [-] Lista (List) — demo/components/RecentActivity.tsx shows list but no generic list component.
- [x] Tabela (Table / Data Table) — demo/components/admin/DataTable.tsx
- [x] Siatka (Grid / Layout Grid) — frontend/src/components/ui/layoutGrid.tsx + sekcja przykładów.
- [x] Akordeon (Accordion) — frontend/src/components/ui/accordion.tsx + sekcja w brandbooku.
- [x] Zakładki (Tabs) — frontend/src/components/ui/tabs.tsx (poziome i pionowe warianty w brandbooku).
- [x] Panel boczny (Sidebar / Drawer) — demo/components/Sidebar.tsx
- [x] Okno modalne (Modal / Dialog) — demo/components/ui/modal.tsx
- [x] Wyskakujące okienko (Popover) — frontend/src/components/ui/popover.tsx + sekcja w brandbooku.
- [x] Podpowiedź „balonik” (Tooltip) — frontend/src/components/ui/tooltip.tsx + sekcja w brandbooku.
- [x] Pasek narzędzi (Toolbar) — frontend/src/components/ui/toolbar.tsx + demo akcji bulk.
- [x] Nagłówek sekcji (Section Header) — frontend/src/components/ui/sectionHeader.tsx + sekcja demonstracyjna.

## Kontrolki nawigacyjne i CTA rozszerzone
- [x] Menu kontekstowe (Context Menu) — frontend/src/components/ui/contextMenu.tsx z przykładami akcji.
- [x] Przycisk rozwijany (Split Button / Menu Button) — frontend/src/components/ui/splitButton.tsx.
- [x] Chipsy / znaczniki (Chips / Tags / Pills) — frontend/src/components/ui/chip.tsx + sekcja filtrów.
- [x] Okruszki filtrów (Filter Pills) — frontend/src/components/ui/chip.tsx `FilterPill`.
- [x] Przycisk "Załaduj więcej" (Load More) — frontend/src/components/ui/loadMoreButton.tsx.
- [x] Wybór daty (Date Picker) — frontend/src/components/ui/datePickers.tsx + sekcja w brandbooku.
- [x] Mega-menu (Mega Menu) — frontend/components/navigation/MegaMenu.tsx + demo sekcja w brandbooku.

## Wejścia specjalistyczne
- [x] Suwak (Slider) — frontend/src/components/ui/slider.tsx (pojedynczy suwak w brandbooku).
- [x] Suwak zakresowy (Range Slider) — frontend/src/components/ui/slider.tsx `RangeSlider`.
- [x] Auto-uzupełnianie (Autocomplete / Typeahead) — frontend/src/components/ui/autocomplete.tsx (statyczny + async wariant).
- [x] Maski wejścia (Input Mask) — frontend/src/components/ui/inputMaskField.tsx z telefonem/PESEL w brandbooku.
- [x] Wybór czasu (Time Picker) — frontend/src/components/ui/datePickers.tsx.
- [x] Wybór daty i czasu (DateTime Picker) — frontend/src/components/ui/datePickers.tsx.
- [x] Wybór pliku (File Uploader) — frontend/src/components/ui/fileUploader.tsx + sekcja uploadu.
- [x] Wybór koloru (Color Picker) — frontend/src/components/ui/formFields.tsx `ColorPickerField`.
- [x] Kroki procesu (Stepper / Wizard) — frontend/src/components/ui/stepper.tsx (rozszerzony); TODO: wariant z widokiem formularza wieloetapowego.

## Prezentacja danych i statusów
- [x] Odznaka stanu (Badge) — frontend/src/components/ui/badge.tsx + sekcja „Badges i statusy”.
- [x] Tag stanu (Status Tag) — frontend/src/components/ui/badge.tsx `StatusTag`.
- [x] Alert (Alert / Banner) — frontend/src/components/ui/alertBanner.tsx (globalny komunikat w brandbooku).
- [x] Inline Message (Helper/Success/Error) — frontend/src/components/ui/inlineMessage.tsx.
- [x] Postęp liniowy (Progress Bar) — frontend/src/components/ui/progress.tsx `ProgressBar`.
- [x] Postęp kołowy (Spinner / Circular Progress) — frontend/src/components/ui/progress.tsx `ProgressCircle`.
- [x] Awatar (Avatar) — frontend/src/components/ui/avatar.tsx.
- [x] Toast (Toast / Snackbar) — demo/components/ui/toast.tsx z sekcją scenariuszy.
- [x] KPI / Stat Card — frontend/src/components/ui/statCard.tsx + sekcja KPI w brandbooku.

## Backlog strategiczny
- [ ] Uporządkowanie tokenów projektowych (kolory, typografia, spacing) + eksport do biblioteki.
- [ ] Layout patterns — spis siatek, sekcji hero, dashboardów z kodem i guideline'ami.
- [ ] Lepsza dokumentacja komponentów (propsy, przykłady, zasady a11y) + automatyzacja generowania.
- [x] Tryb ciemny (Theme Switcher) dla biblioteki i brandbooka.
- [ ] Pipeline wizualnych testów regresyjnych (np. Playwright + percy) dla komponentów UI.
- [ ] Przygotowanie dokumentacji przyjaznej dla AI: struktura promptów, metadane, pliki referencyjne.
- [ ] Rozszerzenie systemu modali: warianty rozmiarów, header/body/footer, dialogi potwierdzeń (zob. docs/architecture/missing-components-analysis).
- [ ] Toast manager z akcjami (undo/retry), sterowanie pozycją i auto-dismiss.
- [ ] Ulepszenia DataTable: sortowanie, filtrowanie, zaznaczanie, puste stany, eksport.
- [ ] Pełny kalendarz i date-range picker (integracja z TimePicker, lokalizacja).
- [ ] Skeleton components (tekst, tabela, karta) dla lepszej percepcji wydajności.
- [ ] Dropdown menu wielopoziomowe i z ikonami (poza context menu).
 - [ ] Zaawansowany kalendarz/agenda dnia (tryb Outlook): widok tygodnia, wydarzenia, przeciąganie, integracja z przepływami CRM.
