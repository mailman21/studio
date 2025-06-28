'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Shield, Calendar } from 'lucide-react';
import { users as initialUsers, type User } from '@/lib/users';
import { UserDialog } from '@/components/user-dialog';
import { Badge } from '@/components/ui/badge';

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };

  const handleDeleteUser = (email: string) => {
    // In a real app, you'd show a confirmation dialog first.
    setUsers(users.filter(u => u.email !== email));
  };

  const handleSaveUser = (user: User) => {
    const isEditing = users.some(u => u.email === user.email);
    if (isEditing) {
      setUsers(users.map(u => u.email === user.email ? user : u));
    } else {
      setUsers([...users, { ...user, password: 'password' }]);
    }
    setIsUserDialogOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Admin Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
           <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Shield className="size-8 text-primary" />
                <div>
                  <CardTitle>Manage Matches</CardTitle>
                  <CardDescription>View, edit, or add past and upcoming matches.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/matches">Go to Matches</Link>
                </Button>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Calendar className="size-8 text-primary" />
                <div>
                  <CardTitle>Manage Schedules</CardTitle>
                  <CardDescription>Edit training schedules and fixtures for teams.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" disabled>Coming Soon</Button>
              </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Add, edit, or remove users from the system.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={handleAddUser}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add User
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.email}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'administrator' ? 'default' : user.role === 'coach' ? 'secondary' : 'outline'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteUser(user.email)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      <UserDialog
        isOpen={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </div>
  );
}
