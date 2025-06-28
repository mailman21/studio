'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type User, type UserRole } from '@/lib/users';

interface UserDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (user: User) => void;
    user: User | null;
}

const userRoles: UserRole[] = ['referee', 'administrator', 'coach'];

export function UserDialog({ isOpen, onOpenChange, onSave, user }: UserDialogProps) {
    const [formData, setFormData] = useState<Omit<User, 'password'>>({ name: '', email: '', role: 'referee' });

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email, role: user.role });
        } else {
            setFormData({ name: '', email: '', role: 'referee' });
        }
    }, [user, isOpen]);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave({ ...formData, password: user?.password || 'password' }); // Keep existing password or set default
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
                    <DialogDescription>
                        {user ? 'Update the details for this user.' : 'Enter the details for the new user.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="col-span-3" disabled={!!user} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select onValueChange={(value) => handleChange('role', value as UserRole)} value={formData.role}>
                            <SelectTrigger id="role" className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {userRoles.map(role => (
                                    <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
