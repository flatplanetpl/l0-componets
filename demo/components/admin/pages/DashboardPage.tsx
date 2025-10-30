// frontend/src/components/admin/pages/DashboardPage.tsx

'use client';

import { useState, useEffect } from 'react';
import DashboardWidgets from '../DashboardWidgets';
import { TrendingUp, Users, BookOpen, CreditCard } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, using mock data
    setStats([
      { title: 'Total Users', value: '12,402', change: '+12.5%', icon: Users, color: 'text-blue-500', changeColor: 'text-green-500' },
      { title: 'Active Courses', value: '86', change: '+3.2%', icon: BookOpen, color: 'text-green-500', changeColor: 'text-green-500' },
      { title: 'Monthly Revenue', value: '$24,580', change: '+8.7%', icon: CreditCard, color: 'text-purple-500', changeColor: 'text-green-500' },
      { title: 'Completion Rate', value: '78%', change: '-1.2%', icon: TrendingUp, color: 'text-yellow-500', changeColor: 'text-red-500' },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Quick Action
          </button>
        </div>
      </div>

      <DashboardWidgets stats={stats} />
      
      {/* Additional dashboard content areas would go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div className="ml-4">
                <p className="font-medium">John Doe enrolled in React Fundamentals</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div className="ml-4">
                <p className="font-medium">Jane Smith completed Advanced JavaScript</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>New Signups (7d)</span>
              <span className="font-medium">142</span>
            </div>
            <div className="flex justify-between">
              <span>Active Sessions</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between">
              <span>Support Tickets</span>
              <span className="font-medium">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}