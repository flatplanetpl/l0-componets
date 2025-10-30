'use client';

import { UserProfile } from '@/components/UserProfile';
import { UserPermissions } from '@/components/UserPermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome to your EduPlatform dashboard</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center">
              <Download className="w-4 h-4 mr-2" /> Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Users</p>
                <h3 className="text-2xl font-bold">12,402</h3>
                <div className="mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+12.5%</span>
                  <span className="text-gray-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Active Courses</p>
                <h3 className="text-2xl font-bold">86</h3>
                <div className="mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+3.2%</span>
                  <span className="text-gray-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Monthly Revenue</p>
                <h3 className="text-2xl font-bold">$24,580</h3>
                <div className="mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+8.7%</span>
                  <span className="text-gray-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserProfile />
          <UserPermissions />
        </div>
      </div>
    </ProtectedRoute>
  );
}