'use client';

import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/shop-data';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getBadgeStyle = (badge: typeof product.badge) => {
    switch (badge) {
      case 'new':
        return 'bg-blue-500 text-white';
      case 'sale':
        return 'bg-rose-500 text-white';
      case 'bestseller':
        return 'bg-emerald-500 text-white';
      default:
        return '';
    }
  };

  const getBadgeText = (badge: typeof product.badge) => {
    switch (badge) {
      case 'new':
        return 'Nowość';
      case 'sale':
        return `-${discount}%`;
      case 'bestseller':
        return 'Bestseller';
      default:
        return '';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
      {/* Badge */}
      {product.badge && (
        <div className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyle(product.badge)}`}>
          {getBadgeText(product.badge)}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-lg font-semibold text-white">Brak w magazynie</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.category}
        </div>

        {/* Name */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground">
          {product.name}
        </h3>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-foreground">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount} opinii)
          </span>
        </div>

        {/* Price */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            {product.price} zł
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice} zł
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full"
          disabled={!product.inStock}
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? 'Dodaj do koszyka' : 'Niedostępny'}
        </Button>
      </div>
    </div>
  );
}
