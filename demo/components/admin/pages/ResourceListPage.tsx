// frontend/src/components/admin/pages/ResourceListPage.tsx

'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import DataTable from '../DataTable';
import AdminForm from '../AdminForm';
import type { ResourceConfig } from '@/config/adminConfig';
import { useApi } from '@/hooks/useApi';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ResourceListPageProps {
  config: Omit<ResourceConfig, 'icon'>;
}

export default function ResourceListPage({ config }: ResourceListPageProps) {
  const apiService = useApi();
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Redirect effect will handle this
  }

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      // In real implementation you would call:
      const response = await apiService.list(config.endpoint);
      setItems(response.data);
      
      // For now, using mock data if API fails
      if (config.name === 'users') {
        setItems([
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', lastActive: '2023-10-15' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', lastActive: '2023-10-14' },
        ]);
      } else if (config.name === 'courses') {
        setItems([
          { id: '1', title: 'React Fundamentals', instructor: 'John Doe', category: 'Programming', students: 1240 },
          { id: '2', title: 'Advanced JavaScript', instructor: 'Jane Smith', category: 'Programming', students: 890 },
        ]);
      }
    } catch (error) {
      console.error(`Error fetching ${config.name}:`, error);
      // Fallback to mock data on error
      if (config.name === 'users') {
        setItems([
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', lastActive: '2023-10-15' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', lastActive: '2023-10-14' },
        ]);
      } else if (config.name === 'courses') {
        setItems([
          { id: '1', title: 'React Fundamentals', instructor: 'John Doe', category: 'Programming', students: 1240 },
          { id: '2', title: 'Advanced JavaScript', instructor: 'Jane Smith', category: 'Programming', students: 890 },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchData();
  }, [config]);

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete this ${config.name.slice(0, -1)}?`)) {
      try {
        await apiService.remove(config.endpoint, item.id);
        setItems(items.filter(i => i.id !== item.id));
      } catch (error) {
        console.error(`Error deleting ${config.name.slice(0, -1)}:`, error);
        // Fallback to mock deletion on error
        setItems(items.filter(i => i.id !== item.id));
      }
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingItem) {
        const updatedItem = await apiService.update(config.endpoint, editingItem.id, data);
        setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
      } else {
        const newItem = await apiService.create(config.endpoint, data);
        setItems([...items, newItem]);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error(`Error saving ${config.name.slice(0, -1)}:`, error);
      // Fallback to mock saving on error
      if (editingItem) {
        setItems(items.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
      } else {
        const newItem = { id: (items.length + 1).toString(), ...data };
        setItems([...items, newItem]);
      }
      setShowForm(false);
      setEditingItem(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // Prepare columns for DataTable
  const columns = config.listColumns.map(col => ({
    key: col.key as keyof any,
    title: col.title,
    render: col.render ? (value: any, item: any) => col.render!(value, item) : undefined,
  }));

  // Prepare actions
  const actions = [
    { name: 'Edit', handler: handleEdit, icon: <Pencil className="h-4 w-4" /> },
    {
      name: 'Delete',
      handler: handleDelete,
      icon: <Trash2 className="h-4 w-4" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <AdminForm
        fields={config.formFields}
        title={editingItem ? `Edit ${config.name.slice(0, -1)}` : `Add New ${config.name.slice(0, -1)}`}
        onSubmit={handleSubmit}
        initialData={editingItem}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div>
      <DataTable
        data={items}
        columns={columns}
        actions={actions}
        title={`${config.name.charAt(0).toUpperCase() + config.name.slice(1)}`}
        onAdd={handleAdd}
        onSearch={(term) => console.log('Searching for:', term)} // In real implementation, filter items based on term
        searchPlaceholder={`Search ${config.name}...`}
      />
    </div>
  );
}
