// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Define types for the manage admin role request
interface ManageAdminRoleData {
  userId: string;
  action: 'grant' | 'revoke';
}

// Initialize super admin function
export const initializeSuperAdmin = functions.https.onRequest(async (req, res) => {
  // Get secret from Firebase config
  const adminSecret = functions.config().admin.setup_secret;

  if (req.query.secretKey !== adminSecret) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  const superAdminEmail = req.query.email as string;
  if (!superAdminEmail) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    // Check if user exists
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(superAdminEmail);
    } catch {
      res.status(404).json({ error: 'User not found. Please create an account first.' });
      return;
    }

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'SUPER_ADMIN'
    });

    // Update user document
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: superAdminEmail,
      role: 'SUPER_ADMIN',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    res.json({ success: true, message: 'Super admin role granted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to initialize super admin' });
  }
});

// Manage admin roles function
export const manageAdminRole = functions.https.onCall(
  async (request: functions.https.CallableRequest<ManageAdminRoleData>) => {
    // Check if the caller is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Must be logged in'
      );
    }

    try {
      // Get caller's role from Firestore
      const callerDoc = await admin.firestore()
        .collection('users')
        .doc(request.auth.uid)
        .get();

      if (!callerDoc.exists || callerDoc.data()?.role !== 'SUPER_ADMIN') {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Must be a super admin to manage roles'
        );
      }

      const { userId, action } = request.data;

      if (action === 'grant') {
        await admin.auth().setCustomUserClaims(userId, { role: 'ADMIN' });
        await admin.firestore().collection('users').doc(userId).update({
          role: 'ADMIN',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else if (action === 'revoke') {
        await admin.auth().setCustomUserClaims(userId, null);
        await admin.firestore().collection('users').doc(userId).update({
          role: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Error managing admin role'
      );
    }
  }
);