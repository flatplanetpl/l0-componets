'use client';

import { ReactNode, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CodeBlock from './CodeBlock';

interface ComponentShowcaseProps {
  title: string;
  description?: string;
  code?: string | string[];
  children?: ReactNode;
  variants?: Array<{
    name: string;
    code: string;
    component: ReactNode;
  }>;
  className?: string;
}

type Tab = 'preview' | 'code';

export default function ComponentShowcase({
  title,
  description,
  code,
  children,
  variants,
  className = ''
}: ComponentShowcaseProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [activeVariant, setActiveVariant] = useState(0);

  const codeToDisplay = Array.isArray(code) ? code[activeVariant] : code;
  const variantCode = variants?.[activeVariant]?.code || codeToDisplay;
  const variantComponent = variants?.[activeVariant]?.component || children;

  return (
    <Card className={`border border-border ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Variant selector */}
        {variants && variants.length > 1 && (
          <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
            {variants.map((variant, index) => (
              <Button
                key={index}
                size="sm"
                variant={activeVariant === index ? 'default' : 'outline'}
                onClick={() => setActiveVariant(index)}
              >
                {variant.name}
              </Button>
            ))}
          </div>
        )}

        {/* Tab buttons */}
        <div className="flex gap-2 border-b border-border" role="tablist">
          <div
            id="preview-tab"
            role="tab"
            aria-selected={activeTab === 'preview'}
            tabIndex={activeTab === 'preview' ? 0 : -1}
            onClick={() => setActiveTab('preview')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveTab('preview');
              }
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === 'preview'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Podgląd
            {activeTab === 'preview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </div>
          <div
            id="code-tab"
            role="tab"
            aria-selected={activeTab === 'code'}
            tabIndex={activeTab === 'code' ? 0 : -1}
            onClick={() => setActiveTab('code')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveTab('code');
              }
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === 'code'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Kod
            {activeTab === 'code' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </div>
        </div>

        {/* Tab content */}
        <div
          role="tabpanel"
          aria-labelledby={activeTab === 'preview' ? 'preview-tab' : 'code-tab'}
          className="min-h-[200px]"
        >
          {activeTab === 'preview' ? (
            <div className="p-4 bg-muted/30 rounded-lg">
              {variantComponent}
            </div>
          ) : (
            <CodeBlock code={variantCode || ''} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
