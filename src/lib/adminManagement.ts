import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const checkIsSuperAdmin = async (userId: string): Promise<boolean> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() && userDoc.data()?.role === 'SUPER_ADMIN';
};

export const manageAdminRole = async (
  currentUserId: string,
  targetUserId: string,
  action: 'grant' | 'revoke'
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if current user is super admin
    const isSuperAdmin = await checkIsSuperAdmin(currentUserId);
    if (!isSuperAdmin) {
      return { 
        success: false, 
        error: 'Permission denied. Must be a super admin to manage roles.' 
      };
    }

    // Update user role
    const userRef = doc(db, 'users', targetUserId);
    await updateDoc(userRef, {
      role: action === 'grant' ? 'ADMIN' : null,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error managing admin role:', error);
    return { 
      success: false, 
      error: 'Failed to manage admin role' 
    };
  }
};