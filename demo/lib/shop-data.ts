export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
  badge?: 'new' | 'sale' | 'bestseller';
}

export const categories = [
  'Elektronika',
  'Moda',
  'Dom i ogród',
  'Sport',
  'Książki',
  'Kosmetyki',
] as const;

export const products: Product[] = [
  {
    id: '1',
    name: 'Słuchawki bezprzewodowe Premium',
    description: 'Najwyższa jakość dźwięku, aktywna redukcja szumów, 30h baterii',
    price: 899,
    originalPrice: 1299,
    image: '/api/placeholder/400/300',
    category: 'Elektronika',
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    featured: true,
    badge: 'sale',
  },
  {
    id: '2',
    name: 'Smartwatch Pro',
    description: 'Monitor zdrowia, GPS, wodoodporność, 7 dni baterii',
    price: 1499,
    image: '/api/placeholder/400/300',
    category: 'Elektronika',
    rating: 4.6,
    reviewCount: 189,
    inStock: true,
    featured: true,
    badge: 'bestseller',
  },
  {
    id: '3',
    name: 'Plecak miejski wodoodporny',
    description: 'Pojemność 25L, komora na laptop 15", system organizacji',
    price: 299,
    image: '/api/placeholder/400/300',
    category: 'Moda',
    rating: 4.9,
    reviewCount: 456,
    inStock: true,
    badge: 'bestseller',
  },
  {
    id: '4',
    name: 'Mata do jogi ekologiczna',
    description: 'Antypoślizgowa, grubość 6mm, materiał biodegradowalny',
    price: 149,
    originalPrice: 199,
    image: '/api/placeholder/400/300',
    category: 'Sport',
    rating: 4.7,
    reviewCount: 123,
    inStock: true,
    badge: 'sale',
  },
  {
    id: '5',
    name: 'Kawa ziarnista Arabica Premium',
    description: 'Palona rzemieślniczo, 100% Arabica, nuty czekoladowe',
    price: 45,
    image: '/api/placeholder/400/300',
    category: 'Dom i ogród',
    rating: 4.9,
    reviewCount: 789,
    inStock: true,
    badge: 'bestseller',
  },
  {
    id: '6',
    name: 'Zestaw doniczek ceramicznych',
    description: '3 doniczki, design skandynawski, z podstawkami',
    price: 129,
    image: '/api/placeholder/400/300',
    category: 'Dom i ogród',
    rating: 4.5,
    reviewCount: 67,
    inStock: true,
  },
  {
    id: '7',
    name: 'Książka "Atomic Habits"',
    description: 'James Clear - przewodnik po budowaniu dobrych nawyków',
    price: 49,
    image: '/api/placeholder/400/300',
    category: 'Książki',
    rating: 4.9,
    reviewCount: 1234,
    inStock: true,
    badge: 'bestseller',
  },
  {
    id: '8',
    name: 'Serum witaminowe C',
    description: 'Rozjaśnia, redukuje przebarwienia, 30ml',
    price: 89,
    image: '/api/placeholder/400/300',
    category: 'Kosmetyki',
    rating: 4.8,
    reviewCount: 456,
    inStock: true,
    badge: 'new',
  },
  {
    id: '9',
    name: 'Butelka termiczna 500ml',
    description: 'Utrzymuje temperaturę 24h, stal nierdzewna',
    price: 79,
    originalPrice: 99,
    image: '/api/placeholder/400/300',
    category: 'Sport',
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    badge: 'sale',
  },
];

export const shopStats = [
  { label: '10 000+', description: 'Zadowolonych klientów' },
  { label: '50 000+', description: 'Produktów w ofercie' },
  { label: '24/7', description: 'Obsługa klienta' },
  { label: '48h', description: 'Darmowa dostawa' },
];

export const shopFeatures = [
  {
    title: 'Darmowa dostawa',
    description: 'Przy zamówieniach powyżej 200 zł',
    icon: '📦',
  },
  {
    title: '30 dni na zwrot',
    description: 'Bez podania przyczyny',
    icon: '↩️',
  },
  {
    title: 'Bezpieczne płatności',
    description: 'SSL, BLIK, karty, raty 0%',
    icon: '🔒',
  },
  {
    title: 'Gwarancja jakości',
    description: 'Oryginalne produkty',
    icon: '✓',
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Anna K.',
    role: 'Zweryfikowany klient',
    content: 'Świetna jakość produktów i błyskawiczna dostawa. Polecam!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michał P.',
    role: 'Stały klient',
    content: 'Rewelacyjna obsługa klienta. Pomogliśmy mi wybrać idealne słuchawki.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Karolina W.',
    role: 'Zweryfikowany klient',
    content: 'Najlepsze ceny i szeroki wybór. Zamawiam regularnie.',
    rating: 5,
  },
];
