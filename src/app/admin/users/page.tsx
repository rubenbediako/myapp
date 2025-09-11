'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, Shield, Calendar } from 'lucide-react';

// This would normally come from a database
const mockUsers = [
  {
    id: 'user1',
    email: 'john@example.com',
    name: 'John Doe',
    emailVerified: true,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'user2', 
    email: 'jane@example.com',
    name: 'Jane Smith',
    emailVerified: false,
    createdAt: '2024-02-20T14:45:00Z',
  },
  {
    id: 'google-user1',
    email: 'google@gmail.com', 
    name: 'Google User',
    emailVerified: true,
    createdAt: '2024-03-10T09:15:00Z',
  },
];

export default function AdminUsersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <Badge variant="secondary">
          <Users className="mr-1 h-3 w-3" />
          {mockUsers.length} Users
        </Badge>
      </div>

      <div className="grid gap-4">
        {mockUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {user.name}
                </span>
                <Badge variant={user.emailVerified ? "default" : "secondary"}>
                  {user.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    {user.emailVerified ? 'Disable' : 'Verify Email'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentication System Status</CardTitle>
          <CardDescription>Current authentication configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Authentication Type:</span>
              <Badge>Custom Cookie-based Auth</Badge>
            </div>
            <div className="flex justify-between">
              <span>Email/Password:</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex justify-between">
              <span>Google OAuth:</span>
              <Badge variant="default">Simulated</Badge>
            </div>
            <div className="flex justify-between">
              <span>Firebase:</span>
              <Badge variant="destructive">Removed</Badge>
            </div>
            <div className="flex justify-between">
              <span>Session Storage:</span>
              <Badge variant="secondary">Browser Cookies</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
