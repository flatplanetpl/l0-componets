'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Define the specific Recharts component types that need to be wrapped
interface ChartComponentProps {
  [key: string]: any;
}

// Create dynamically imported chart components with proper typing
export const DynamicLineChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.LineChart as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;

export const DynamicLine = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Line as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;

export const DynamicXAxis = dynamic(
  () => import('recharts').then(mod => ({ default: mod.XAxis as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;

export const DynamicYAxis = dynamic(
  () => import('recharts').then(mod => ({ default: mod.YAxis as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;

export const DynamicCartesianGrid = dynamic(
  () => import('recharts').then(mod => ({ default: mod.CartesianGrid as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;

export const DynamicTooltip = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Tooltip as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;

export const DynamicResponsiveContainer = dynamic(
  () => import('recharts').then(mod => ({ default: mod.ResponsiveContainer as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;

export const DynamicAreaChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.AreaChart as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;

export const DynamicArea = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Area as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;

export const DynamicBarChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.BarChart as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;

export const DynamicBar = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Bar as React.ComponentType<any> })),
  { ssr: false }
) as ComponentType<ChartComponentProps>;