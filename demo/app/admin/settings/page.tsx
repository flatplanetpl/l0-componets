'use client';

import { useState } from 'react';
import { Save, User, Shield, Key, Globe, Bell, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <nav className="space-y-1">
              {[
                { id: 'account', label: 'Account', icon: 'User' },
                { id: 'security', label: 'Security', icon: 'Shield' },
                { id: 'notifications', label: 'Notifications', icon: 'Bell' },
                { id: 'privacy', label: 'Privacy', icon: 'Globe' },
              ].map((tab) => {
                const renderTabIcon = (iconName: string) => {
                  const className = "w-5 h-5 mr-3";
                  switch (iconName) {
                    case 'User': return <User className={className} />;
                    case 'Shield': return <Shield className={className} />;
                    case 'Bell': return <Bell className={className} />;
                    case 'Globe': return <Globe className={className} />;
                    default: return <div className={className} />;
                  }
                };
                return (
                  <button
                    key={tab.id}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {renderTabIcon(tab.icon)}
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Account Settings</h2>
            
            <div className="flex flex-col md:flex-row gap-8 mb-6">
              <div className="flex flex-col items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-gray-500" />
                </div>
                <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm">
                  Change Photo
                </button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    defaultValue="Administrator of EduPlatform"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}