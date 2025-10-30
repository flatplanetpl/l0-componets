'use client';

import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Navigation from '@/components/general/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartProvider, useCart } from '@/contexts/CartContext';

function CartContent() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  const navItems = [
    { name: 'Strona główna', href: '/shop' },
    { name: 'Wszystkie produkty', href: '/shop/products' },
    { name: 'Kategorie', href: '/shop/categories' },
    { name: 'O nas', href: '/shop/about' },
  ];

  const shipping = totalPrice >= 200 ? 0 : 15;
  const finalTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation navItems={navItems} ctaText="Konto" />

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold text-foreground">
              Twój koszyk jest pusty
            </h2>
            <p className="mt-2 text-muted-foreground">
              Dodaj produkty do koszyka, aby kontynuować zakupy
            </p>
            <Button
              size="lg"
              className="mt-8"
              onClick={() => router.push('/shop/products')}
            >
              Przeglądaj produkty
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation navItems={navItems} ctaText="Konto" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Koszyk</h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {item.name}
                              </h3>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.category}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-rose-600 hover:text-rose-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="font-bold text-foreground">
                                {item.price * item.quantity} zł
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-muted-foreground">
                                  {item.price} zł / szt.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-4"
              onClick={clearCart}
            >
              Wyczyść koszyk
            </Button>
          </div>

          {/* Summary */}
          <div className="mt-8 lg:mt-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Podsumowanie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Produkty ({totalItems})
                  </span>
                  <span className="font-medium">{totalPrice} zł</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dostawa</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">Gratis!</span>
                    ) : (
                      `${shipping} zł`
                    )}
                  </span>
                </div>

                {shipping > 0 && totalPrice < 200 && (
                  <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
                    Dodaj produkty za {200 - totalPrice} zł, aby otrzymać
                    darmową dostawę!
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Razem</span>
                    <span className="text-lg font-bold">{finalTotal} zł</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => router.push('/shop/checkout')}
                >
                  Przejdź do kasy
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/shop/products')}
                >
                  Kontynuuj zakupy
                </Button>

                {/* Trust Badges */}
                <div className="space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Bezpieczne płatności</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>30 dni na zwrot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Gwarancja producenta</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartContent />
    </CartProvider>
  );
}
