'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Filter } from 'lucide-react';
import Navigation from '@/components/general/Navigation';
import ProductCard from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { products, categories } from '@/lib/shop-data';

function ProductsContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { addItem, totalItems, totalPrice } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'popular'>('popular');

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    showToast({
      title: 'Dodano do koszyka',
      description: `${product.name} został dodany do koszyka`,
      variant: 'success',
    });
  };

  const navItems = [
    { name: 'Strona główna', href: '/shop' },
    { name: 'Wszystkie produkty', href: '/shop/products' },
    { name: 'Kategorie', href: '/shop/categories' },
    { name: 'O nas', href: '/shop/about' },
  ];

  // Filter products
  let filteredProducts = products;
  if (selectedCategory) {
    filteredProducts = products.filter((p) => p.category === selectedCategory);
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation navItems={navItems} ctaText="Konto" />

      {/* Cart Badge */}
      {totalItems > 0 && (
        <Button
          className="fixed right-6 top-20 z-50 shadow-lg"
          size="lg"
          onClick={() => router.push('/shop/cart')}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Koszyk ({totalItems})
          <span className="ml-2 font-bold">{totalPrice} zł</span>
        </Button>
      )}

      {/* Header */}
      <div className="bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Wszystkie produkty
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Odkryj naszą pełną ofertę - {products.length} produktów
          </p>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Filters */}
          <div className="mb-8 lg:mb-0">
            <div className="sticky top-24 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                  <Filter className="mr-2 h-5 w-5" />
                  Kategorie
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full rounded-lg px-4 py-2 text-left transition ${
                      selectedCategory === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    Wszystkie ({products.length})
                  </button>
                  {categories.map((category) => {
                    const count = products.filter((p) => p.category === category).length;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full rounded-lg px-4 py-2 text-left transition ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {category} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Sortowanie
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                >
                  <option value="popular">Najpopularniejsze</option>
                  <option value="price-asc">Cena: rosnąco</option>
                  <option value="price-desc">Cena: malejąco</option>
                  <option value="rating">Najwyżej oceniane</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-muted-foreground">
              Znaleziono {sortedProducts.length} produktów
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-lg text-muted-foreground">
                  Nie znaleziono produktów w tej kategorii
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <CartProvider>
      <ProductsContent />
    </CartProvider>
  );
}
