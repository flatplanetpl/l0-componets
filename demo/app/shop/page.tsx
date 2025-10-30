'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import Hero from '@/components/general/Hero';
import Navigation from '@/components/general/Navigation';
import Stats from '@/components/general/Stats';
import Features from '@/components/general/Features';
import TestimonialSlider from '@/components/general/TestimonialSlider';
import CTA from '@/components/general/CTA';
import ProductCard from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { products, shopStats, shopFeatures, testimonials } from '@/lib/shop-data';

function ShopContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { addItem, totalItems, totalPrice } = useCart();

  const featuredProducts = products.filter((p) => p.featured);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation with Cart */}
      <div className="relative">
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
      </div>

      {/* Hero Section */}
      <Hero
        title="Twój ulubiony sklep online"
        subtitle="Najlepsze produkty w najlepszych cenach. Darmowa dostawa od 200 zł!"
        ctaText="Zobacz ofertę"
        ctaAction={() => router.push('/shop/products')}
        secondaryCtaText="Bestsellery"
        secondaryCtaAction={() => {
          const bestsellersSection = document.getElementById('bestsellers');
          bestsellersSection?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Stats */}
      <div className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stats stats={shopStats} />
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Dlaczego warto u nas kupować?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Zapewniamy najwyższy standard obsługi i bezpieczeństwa zakupów
            </p>
          </div>
          <Features features={shopFeatures} />
        </div>
      </div>

      {/* Featured Products */}
      <div id="bestsellers" className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Polecane produkty
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Najcz

ęściej wybierane przez naszych klientów
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={() => router.push('/shop/products')}>
              Zobacz wszystkie produkty
            </Button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Co mówią nasi klienci?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Opinie zweryfikowanych kupujących
            </p>
          </div>
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </div>

      {/* CTA */}
      <CTA
        title="Gotowy na zakupy?"
        subtitle="Dołącz do tysięcy zadowolonych klientów i zacznij zakupy już dziś!"
        primaryButtonText="Przeglądaj produkty"
        primaryButtonAction={() => router.push('/shop/products')}
        secondaryButtonText="Dowiedz się więcej"
        secondaryButtonAction={() => router.push('/shop/about')}
        bgColor="blue"
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <CartProvider>
      <ShopContent />
    </CartProvider>
  );
}
