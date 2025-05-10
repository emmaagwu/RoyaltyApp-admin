import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Define the roles your app uses
export type AdminRole = 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';

// Profile interface matching your Supabase table
export interface Profile {
  id: string;
  email: string;
  role: AdminRole;
  // Add any other profile fields here
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch the user's full profile including role
  const fetchProfile = async (userId: string): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data as Profile;
  };

  // Email/password login
  const signInWithPassword = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    // Fetch profile and validate role
    const profile = await fetchProfile(data.user.id);
    if (!['ADMIN', 'SUPER_ADMIN'].includes(profile.role)) {
      await supabase.auth.signOut();
      setLoading(false);
      throw new Error('You do not have admin access');
    }
    setUser(profile);
    setLoading(false);
  };

  // Google OAuth login
  const signInWithOAuth = async (provider: 'google') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin }
    });
    if (error) {
      setLoading(false);
      throw error;
    }
    // The redirect will trigger onAuthStateChange after returning
  };

  // Logout
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  // Initialize session and listen for changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }
        try {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        } catch (err) {
          console.error(err);
          await supabase.auth.signOut();
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id)
          .then((p) => setUser(p))
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => {
      listener.subscription?.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithPassword, signInWithOAuth, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};


// src/contexts/AuthContext.tsx - Updated version
// import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../lib/supabase';

// export type AdminRole = 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';

// export interface Profile {
//   id: string;
//   email: string;
//   role: AdminRole;
//   first_name?: string;
//   last_name?: string;
//   profile_image_url?: string;
//   // Add other profile fields as needed
// }

// interface AuthContextType {
//   user: Profile | null;
//   loading: boolean;
//   signInWithPassword: (email: string, password: string) => Promise<Profile | void>;
//   signInWithOAuth: (provider: 'google') => Promise<void>;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Helper to fetch the user's full profile including role
//   const fetchProfile = async (userId: string): Promise<Profile | null> => {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', userId)
//         .single();
      
//       if (error) {
//         console.error('Error fetching profile:', error);
//         return null;
//       }
      
//       return data as Profile;
//     } catch (err) {
//       console.error('Profile fetch error:', err);
//       return null;
//     }
//   };

//   // Email/password login
//   const signInWithPassword = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
//       if (error) {
//         throw error;
//       }
      
//       // Fetch profile and validate role
//       const profile = await fetchProfile(data.user.id);
      
//       if (!profile || !['ADMIN', 'SUPER_ADMIN'].includes(profile.role)) {
//         await supabase.auth.signOut();
//         throw new Error('You do not have admin access');
//       }
      
//       setUser(profile);
//       return profile;
//     } catch (err) {
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google OAuth login
//   const signInWithOAuth = async (provider: 'google') => {
//     try {
//       setLoading(true);
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider,
//         options: { redirectTo: window.location.origin }
//       });
      
//       if (error) {
//         throw error;
//       }
//     } catch (err) {
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout
//   const signOut = async () => {
//     try {
//       setLoading(true);
//       await supabase.auth.signOut();
//       setUser(null);
//       navigate('/login');
//     } catch (err) {
//       console.error('Sign out error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize session and listen for changes
//   useEffect(() => {
//     // This function handles session changes
//     const handleAuthChange = async (session: any) => {
//       if (!session?.user) {
//         setUser(null);
//         setLoading(false);
//         return;
//       }
      
//       try {
//         const profile = await fetchProfile(session.user.id);
        
//         if (profile && ['ADMIN', 'SUPER_ADMIN'].includes(profile.role)) {
//           setUser(profile);
//         } else {
//           // If profile doesn't exist or doesn't have admin role, sign out
//           console.warn('Invalid profile or insufficient permissions');
//           await supabase.auth.signOut();
//           setUser(null);
//         }
//       } catch (err) {
//         console.error('Auth change error:', err);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Set up the auth listener
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       async (_event, session) => {
//         await handleAuthChange(session);
//       }
//     );

//     // Check existing session on mount with timeout
//     const checkSession = async () => {
//       try {
//         const { data: { session } } = await supabase.auth.getSession();
//         await handleAuthChange(session);
//       } catch (err) {
//         console.error('Session check error:', err);
//         setLoading(false);
//       }
//     };

//     // Add a safety timeout to ensure loading state is cleared
//     const safetyTimeout = setTimeout(() => {
//       if (loading) {
//         console.warn('Auth loading timed out - forcing completion');
//         setLoading(false);
//       }
//     }, 5000); // 5 second timeout

//     checkSession();

//     return () => {
//       clearTimeout(safetyTimeout);
//       authListener?.subscription?.unsubscribe();
//     };
//   }, [navigate]);

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, signInWithPassword, signInWithOAuth, signOut }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// };
