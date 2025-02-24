import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
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
import { manageAdminRole } from '@/lib/adminManagement';

interface User {
  uid: string;
  email: string;
  displayName?: string;
  role?: string;
}

const AdminManagementTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check if current user is super admin
    const checkCurrentUserRole = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        setCurrentUserRole(userDoc.data()?.role || null);
      }
    };
    checkCurrentUserRole();

    // Subscribe to users collection
    const usersQuery = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData: User[] = [];
      snapshot.forEach((doc) => {
        usersData.push({
          uid: doc.id,
          ...doc.data() as Omit<User, 'uid'>
        });
      });
      setUsers(usersData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (user: User, action: 'grant' | 'revoke') => {
    if (!auth.currentUser) return;

    try {
      const result = await manageAdminRole(auth.currentUser.uid, user.uid, action);
      if (!result.success) {
        console.error(result.error);
        // You might want to add a toast or alert here
      }
    } catch (error) {
      console.error('Error managing role:', error);
    }
    setDialogOpen(false);
  };

  if (currentUserRole !== 'SUPER_ADMIN') {
    return null; // Hide tab if not super admin
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Management</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.uid}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role || 'User'}</TableCell>
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
                  >
                    Make Admin
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedUser?.role === 'ADMIN' ? 'revoke' : 'grant'} admin 
              access for {selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.role === 'ADMIN' ? 'destructive' : 'default'}
              onClick={() => handleRoleChange(
                selectedUser!, 
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