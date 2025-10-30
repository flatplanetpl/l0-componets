'use client';

import { useState } from 'react';
import { Search, Plus, MoreHorizontal, FileText, MessageSquare, Calendar, Eye, Edit3, Trash2, Filter, Download, Upload } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ContentItem {
  id: string;
  title: string;
  type: 'Lesson' | 'Article' | 'Video' | 'Quiz' | 'Assignment';
  category: string;
  date: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  views: number;
  author: string;
}

const initialContent: ContentItem[] = [
  { id: '1', title: 'Introduction to React', type: 'Lesson', category: 'Programming', date: '2023-10-15', status: 'Published', views: 1240, author: 'John Doe' },
  { id: '2', title: 'Advanced JavaScript', type: 'Article', category: 'Programming', date: '2023-10-14', status: 'Published', views: 890, author: 'Jane Smith' },
  { id: '3', title: 'UI/UX Design Principles', type: 'Video', category: 'Design', date: '2023-10-13', status: 'Published', views: 2100, author: 'Robert Johnson' },
  { id: '4', title: 'Python for Beginners', type: 'Quiz', category: 'Programming', date: '2023-10-12', status: 'Scheduled', views: 0, author: 'Emily Davis' },
  { id: '5', title: 'Data Science Basics', type: 'Assignment', category: 'Data Science', date: '2023-10-10', status: 'Draft', views: 0, author: 'Michael Wilson' },
  { id: '6', title: 'Mobile App Development', type: 'Lesson', category: 'Mobile', date: '2023-10-09', status: 'Published', views: 320, author: 'Sarah Johnson' },
  { id: '7', title: 'Machine Learning Fundamentals', type: 'Article', category: 'Data Science', date: '2023-10-08', status: 'Published', views: 1560, author: 'David Brown' },
  { id: '8', title: 'Web Accessibility', type: 'Video', category: 'Design', date: '2023-10-07', status: 'Published', views: 780, author: 'Lisa Miller' },
];

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'programming', name: 'Programming' },
  { id: 'design', name: 'Design' },
  { id: 'data-science', name: 'Data Science' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'business', name: 'Business' },
];

const types = [
  { id: 'all', name: 'All Types' },
  { id: 'lesson', name: 'Lesson' },
  { id: 'article', name: 'Article' },
  { id: 'video', name: 'Video' },
  { id: 'quiz', name: 'Quiz' },
  { id: 'assignment', name: 'Assignment' },
];

const statuses = [
  { id: 'all', name: 'All Statuses' },
  { id: 'published', name: 'Published' },
  { id: 'draft', name: 'Draft' },
  { id: 'scheduled', name: 'Scheduled' },
];

export default function AdminContentPage() {
  const [contentItems] = useState<ContentItem[]>(initialContent);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Redirect effect will handle this
  }

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory;
    const matchesType = selectedType === 'all' || item.type.toLowerCase() === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status.toLowerCase() === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lesson': return 'bg-blue-100 text-blue-800';
      case 'article': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'quiz': return 'bg-yellow-100 text-yellow-800';
      case 'assignment': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddContent = () => {
    // In a real app, this would navigate to a content creation page
    alert('Add content functionality would be implemented here.');
  };

  const handleEditContent = (id: string) => {
    // In a real app, this would navigate to a content editing page
    alert(`Edit content with ID: ${id}`);
  };

  const handleDeleteContent = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      // In a real app, this would delete the content
      alert(`Delete content with ID: ${id}`);
    }
  };

  const handleViewContent = (id: string) => {
    // In a real app, this would navigate to view the content
    alert(`View content with ID: ${id}`);
  };

  return (
    <ProtectedRoute requiredRole="operator">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Content Management</h1>
            <p className="text-gray-600">Manage educational content and resources</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
              <Search className="w-4 h-4 mr-2" /> Search
            </button>
            <button 
              onClick={handleAddContent}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Content
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search content..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
              
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Download className="w-4 h-4" />
                </button>
                <button className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">{item.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {item.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.views.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewContent(item.id)}
                          className="text-gray-500 hover:text-gray-700"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEditContent(item.id)}
                          className="text-green-500 hover:text-green-700"
                          title="Edit"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteContent(item.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700" title="More">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredContent.length}</span> of{' '}
              <span className="font-medium">{filteredContent.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 border rounded-md bg-blue-500 text-white">1</button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Content Items</p>
                <h3 className="text-2xl font-bold">{contentItems.length}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Eye className="w-6 h-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Views</p>
                <h3 className="text-2xl font-bold">{contentItems.reduce((sum, item) => sum + item.views, 0).toLocaleString()}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <MessageSquare className="w-6 h-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Published Items</p>
                <h3 className="text-2xl font-bold">
                  {contentItems.filter(item => item.status === 'Published').length}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Content by Category</h2>
            <div className="h-64">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center text-gray-500">
                Category distribution chart
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Content by Type</h2>
            <div className="h-64">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center text-gray-500">
                Type distribution chart
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}