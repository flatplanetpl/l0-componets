'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function UserProfile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
            <span className="text-gray-500">U</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">User Name</h3>
            <p className="text-gray-500">user@example.com</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}