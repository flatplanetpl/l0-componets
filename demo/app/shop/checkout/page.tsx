'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import Navigation from '@/components/general/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TextField, TextareaField } from '@frontend/components/ui/formFields';
import { useToast } from '@/components/ui/toast';
import { CartProvider, useCart } from '@/contexts/CartContext';

function CheckoutContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { items, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'blik' | 'transfer'>('card');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup' | 'locker'>('courier');

  const navItems = [
    { name: 'Strona główna', href: '/shop' },
    { name: 'Wszystkie produkty', href: '/shop/products' },
    { name: 'Kategorie', href: '/shop/categories' },
    { name: 'O nas', href: '/shop/about' },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const deliveryCosts = {
    courier: totalPrice >= 200 ? 0 : 15,
    pickup: 0,
    locker: 10,
  };

  const deliveryCost = deliveryCosts[deliveryMethod];
  const finalTotal = totalPrice + deliveryCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      showToast({
        title: 'Błąd',
        description: 'Proszę wypełnić wszystkie wymagane pola',
        variant: 'error',
      });
      return;
    }

    // Success
    showToast({
      title: 'Zamówienie złożone!',
      description: `Dziękujemy za zakupy! Potwierdzenie zostanie wysłane na ${formData.email}`,
      variant: 'success',
    });

    clearCart();

    setTimeout(() => {
      router.push('/shop');
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation navItems={navItems} ctaText="Konto" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              Koszyk jest pusty. Dodaj produkty przed przejściem do kasy.
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
        <h1 className="mb-8 text-3xl font-bold text-foreground">Kasa</h1>

        <form onSubmit={handleSubmit}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Dane osobowe</CardTitle>
                  <CardDescription>Informacje do faktury i wysyłki</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      id="firstName"
                      label="Imię"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                    <TextField
                      id="lastName"
                      label="Nazwisko"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                  </div>

                  <TextField
                    id="email"
                    label="Email"
                    type="email"
                    required
                    helperText="Na ten adres wyślemy potwierdzenie zamówienia"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />

                  <TextField
                    id="phone"
                    label="Telefon"
                    type="tel"
                    required
                    helperText="Kurrier może skontaktować się w sprawie dostawy"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Delivery */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Dostawa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('courier')}
                      className={`rounded-lg border-2 p-4 text-left transition ${
                        deliveryMethod === 'courier'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-border hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">Kurier</div>
                      <div className="text-sm text-muted-foreground">
                        {deliveryCosts.courier === 0 ? 'Gratis' : `${deliveryCosts.courier} zł`}
                      </div>
                      <div className="mt-1 text-xs">2-3 dni</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`rounded-lg border-2 p-4 text-left transition ${
                        deliveryMethod === 'pickup'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-border hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">Odbiór osobisty</div>
                      <div className="text-sm text-muted-foreground">Gratis</div>
                      <div className="mt-1 text-xs">Dziś</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('locker')}
                      className={`rounded-lg border-2 p-4 text-left transition ${
                        deliveryMethod === 'locker'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-border hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">Paczkomat</div>
                      <div className="text-sm text-muted-foreground">10 zł</div>
                      <div className="mt-1 text-xs">1-2 dni</div>
                    </button>
                  </div>

                  {deliveryMethod !== 'pickup' && (
                    <>
                      <TextField
                        id="address"
                        label="Adres"
                        required={deliveryMethod !== 'pickup'}
                        placeholder="ul. Przykładowa 123"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                      />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                          id="city"
                          label="Miasto"
                          required={deliveryMethod !== 'pickup'}
                          value={formData.city}
                          onChange={(e) => handleChange('city', e.target.value)}
                        />
                        <TextField
                          id="postalCode"
                          label="Kod pocztowy"
                          required={deliveryMethod !== 'pickup'}
                          placeholder="00-000"
                          value={formData.postalCode}
                          onChange={(e) => handleChange('postalCode', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <TextareaField
                    id="notes"
                    label="Uwagi do zamówienia"
                    helperText="Opcjonalne informacje dla kuriera"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Płatność
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`rounded-lg border-2 p-4 text-left transition ${
                        paymentMethod === 'card'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-border hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">Karta</div>
                      <div className="text-xs text-muted-foreground">
                        Visa, Mastercard
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('blik')}
                      className={`rounded-lg border-2 p-4 text-left transition ${
                        paymentMethod === 'blik'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-border hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">BLIK</div>
                      <div className="text-xs text-muted-foreground">
                        Natychmiastowa płatność
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`rounded-lg border-2 p-4 text-left transition ${
                        paymentMethod === 'transfer'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-border hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">Przelew</div>
                      <div className="text-xs text-muted-foreground">
                        Tradycyjny przelew
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Podsumowanie zamówienia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Products */}
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          {item.price * item.quantity} zł
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Produkty</span>
                      <span className="font-medium">{totalPrice} zł</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dostawa</span>
                      <span className="font-medium">
                        {deliveryCost === 0 ? (
                          <span className="text-emerald-600">Gratis!</span>
                        ) : (
                          `${deliveryCost} zł`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-lg font-bold">Razem</span>
                      <span className="text-lg font-bold">{finalTotal} zł</span>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Zamów i zapłać
                  </Button>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>Bezpieczne płatności SSL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>Ochrona danych osobowych</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>30 dni na zwrot bez podania przyczyny</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
}
