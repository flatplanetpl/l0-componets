// frontend/src/config/adminConfig.ts

import { Users, BookOpen, CreditCard, FileText, Settings, BarChart3 } from 'lucide-react';

export interface ResourceConfig {
  name: string;
  endpoint: string;
  icon: React.ElementType;
  permissions: string[];
  listColumns: Array<{
    key: string;
    title: string;
    render?: (value: any, item: any) => React.ReactNode;
  }>;
  formFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';
    options?: { label: string; value: string }[];
    required?: boolean;
    placeholder?: string;
  }>;
}

export interface AdminConfig {
  title: string;
  resources: ResourceConfig[];
  navItems: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
    roles: string[];
  }>;
}

export const defaultAdminConfig: AdminConfig = {
  title: 'Admin Panel',
  navItems: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3, roles: ['user', 'operator', 'admin'] },
    { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen, roles: ['user', 'operator', 'admin'] },
    { name: 'Finance', href: '/admin/finance', icon: CreditCard, roles: ['admin'] },
    { name: 'Content', href: '/admin/content', icon: FileText, roles: ['operator', 'admin'] },
    { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['user', 'operator', 'admin'] },
  ],
  resources: [
    {
      name: 'users',
      endpoint: 'users',
      icon: Users,
      permissions: ['read', 'create', 'update', 'delete'],
      listColumns: [
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email' },
        { key: 'role', title: 'Role' },
        { key: 'lastActive', title: 'Last Active' },
      ],
      formFields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { 
          name: 'role', 
          label: 'Role', 
          type: 'select', 
          options: [
            { label: 'User', value: 'user' },
            { label: 'Operator', value: 'operator' },
            { label: 'Admin', value: 'admin' }
          ],
          required: true 
        },
      ],
    },
    {
      name: 'courses',
      endpoint: 'courses',
      icon: BookOpen,
      permissions: ['read', 'create', 'update', 'delete'],
      listColumns: [
        { key: 'title', title: 'Title' },
        { key: 'instructor', title: 'Instructor' },
        { key: 'category', title: 'Category' },
        { key: 'students', title: 'Students' },
      ],
      formFields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'instructor', label: 'Instructor', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'price', label: 'Price', type: 'number' },
      ],
    }
  ],
};

export const getAdminConfig = (): AdminConfig => {
  // In a real app, this might fetch from an API or environment
  return defaultAdminConfig;
};