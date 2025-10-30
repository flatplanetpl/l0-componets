'use client';

import { TrendingUp, TrendingDown, Users, BookOpen, CreditCard, CheckCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  changeColor: string;
}

const StatCard = ({ title, value, change, icon: Icon, color, changeColor }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {change.startsWith('+') ? <TrendingUp className="w-4 h-4 text-green-500 mr-1" /> : <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
      <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
      <span className="text-gray-500 text-sm ml-1">from last month</span>
    </div>
  </div>
);

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Users" 
        value="12,402" 
        change="+12.5%" 
        icon={Users} 
        color="text-blue-500" 
        changeColor="text-green-500"
      />
      <StatCard 
        title="Active Courses" 
        value="86" 
        change="+3.2%" 
        icon={BookOpen} 
        color="text-green-500" 
        changeColor="text-green-500"
      />
      <StatCard 
        title="Monthly Revenue" 
        value="$24,580" 
        change="+8.7%" 
        icon={CreditCard} 
        color="text-purple-500" 
        changeColor="text-green-500"
      />
      <StatCard 
        title="Completion Rate" 
        value="78%" 
        change="-1.2%" 
        icon={CheckCircle} 
        color="text-yellow-500" 
        changeColor="text-red-500"
      />
    </div>
  );
}