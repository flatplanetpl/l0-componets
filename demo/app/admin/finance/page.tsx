'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import the charts component
const FinanceCharts = dynamic(() => import('@/components/FinanceCharts'), { 
  ssr: false,
  loading: () => <div className="h-80 flex items-center justify-center">Loading charts...</div>
});

const revenueData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
  { name: 'Aug', revenue: 4000, expenses: 4100 },
  { name: 'Sep', revenue: 3000, expenses: 3900 },
  { name: 'Oct', revenue: 4500, expenses: 4200 },
];

export default function FinanceDashboard() {
  const [summary] = useState({
    revenue: 24580,
    expenses: 12400,
    profit: 12180,
    subscriptions: 320
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Finance Management</h1>
          <p className="text-gray-600">View financial reports and transactions</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <div className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold">${summary.revenue.toLocaleString()}</h3>
              <div className="mt-1 flex items-center">
                <div className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm">+12.5%</span>
                <span className="text-gray-500 text-sm ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <div className="w-6 h-6 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm font-medium">Expenses</p>
              <h3 className="text-2xl font-bold">${summary.expenses.toLocaleString()}</h3>
              <div className="mt-1 flex items-center">
                <div className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-red-500 text-sm">+3.2%</span>
                <span className="text-gray-500 text-sm ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <div className="w-6 h-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm font-medium">Net Profit</p>
              <h3 className="text-2xl font-bold">${summary.profit.toLocaleString()}</h3>
              <div className="mt-1 flex items-center">
                <div className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm">+15.7%</span>
                <span className="text-gray-500 text-sm ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <div className="w-6 h-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm font-medium">Subscriptions</p>
              <h3 className="text-2xl font-bold">{summary.subscriptions}</h3>
              <div className="mt-1 flex items-center">
                <div className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm">+8.3%</span>
                <span className="text-gray-500 text-sm ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FinanceCharts revenueData={revenueData} />
    </div>
  );
}