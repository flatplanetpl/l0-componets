'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function UserPermissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
        <CardDescription>Your role and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-5 h-5" />
            <span className="text-gray-700">view:profile</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-5 h-5" />
            <span className="text-gray-700">edit:profile</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-5 h-5" />
            <span className="text-gray-700">view:courses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}