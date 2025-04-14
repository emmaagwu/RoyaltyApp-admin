import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Updated interface to match your actual profiles table structure
interface User {
  id: string;  
  first_name?: string;
  last_name?: string;
  role?: 'member' | 'ADMIN' | 'SUPER_ADMIN';
  // Remove email field since it doesn't exist in profiles table
}

const AdminManagementTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Fetch users and set up role check
  useEffect(() => {
    let isMounted = true;

    // Check current user role
    const checkCurrentUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          if (isMounted) {
            setCurrentUserRole(null);
            setIsLoading(false);
          }
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error checking role:', error);
          if (isMounted) {
            setCurrentUserRole(null);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setCurrentUserRole(profile?.role || null);

          // Only fetch users if the current user is a SUPER_ADMIN
          if (profile?.role === 'SUPER_ADMIN') {
            fetchUsers();
          } else {
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Role check 2 error:', err);
        if (isMounted) {
          setCurrentUserRole(null);
          setIsLoading(false);
        }
      }
    };

    // Fetch all users
    const fetchUsers = async () => {
      try {
        console.log('Fetching all users');
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role');

        if (error) {
          console.error('Fetch error details:', error);
          throw error;
        }

        console.log('Fetched users:', data?.length || 0);
        
        if (isMounted) {
          setUsers(data || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        if (isMounted) {
          setIsLoading(false);
          // FIX: Use a string for the description instead of an object
          toast.error("Failed to load users. Please refresh the page.");
        }
      }
    };

    checkCurrentUserRole();

    // Set up subscription for real-time updates
    const channel = supabase.channel('profiles-changes');

    channel
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (!isMounted) return;

          // Handle the different change types
          if (payload.eventType === 'INSERT') {
            setUsers(prev => [...prev, payload.new as User]);
          } else if (payload.eventType === 'UPDATE') {
            setUsers(prev => prev.map(u => u.id === payload.new.id ? payload.new as User : u));
          } else if (payload.eventType === 'DELETE') {
            setUsers(prev => prev.filter(u => u.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      channel.unsubscribe();
    };
  }, []);

  const handleRoleChange = async (action: 'grant' | 'revoke') => {
    if (!selectedUser?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: action === 'grant' ? 'ADMIN' : 'member' })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // FIX: Use simple string for toast instead of object with title/description
      toast.success(`Admin privileges ${action === 'grant' ? 'granted' : 'revoked'} successfully.`);

      // Update local state to reflect the change
      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ? { ...user, role: action === 'grant' ? 'ADMIN' : 'member' }
            : user
        )
      );
    } catch (error) {
      console.error('Error updating role:', error);
      // FIX: Use simple string for toast instead of object with title/description
      toast.error("Failed to update user role. Please try again.");
    }
    setDialogOpen(false);
  };

  if (currentUserRole !== 'SUPER_ADMIN') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need SUPER_ADMIN privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Management</h2>
        <p className="text-sm text-gray-500">Total users: {users.length}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.role || 'member'}</TableCell>
              <TableCell>
                {user.role === 'ADMIN' ? (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      setSelectedUser(user);
                      setDialogOpen(true);
                    }}
                  >
                    Revoke Admin
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedUser(user);
                      setDialogOpen(true);
                    }}
                    disabled={user.role === 'SUPER_ADMIN'}
                  >
                    Make Admin
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedUser?.role === 'ADMIN' ? 'revoke' : 'grant'} admin 
              access for {selectedUser?.first_name} {selectedUser?.last_name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.role === 'ADMIN' ? 'destructive' : 'default'}
              onClick={() => handleRoleChange(
                selectedUser?.role === 'ADMIN' ? 'revoke' : 'grant'
              )}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagementTab;