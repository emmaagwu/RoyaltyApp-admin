// import { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { supabase } from '@/lib/supabase';
// import { AdminRole } from '@/types/auth';


// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredRole?: AdminRole;  // 'SUPER_ADMIN' | 'ADMIN'
// }


// export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
//   const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
//   const [userRole, setUserRole] = useState<AdminRole | null>(null);
//   // const navigate = useNavigate();

//   useEffect(() => {
//     let isMounted = true;
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (session?.user) {
//           try {
//             const { data, error } = await supabase
//               .from('profiles')
//               .select('role')
//               .eq('id', session.user.id)
//               .single();

//             if (isMounted) {
//               if (error || !data) {
//                 console.error('Role check error:', error);
//                 setAuthStatus('unauthenticated');
//                 setUserRole(null);
//               } else {
//                 setUserRole(data.role as AdminRole);
//                 setAuthStatus('authenticated');
//               }
//             }
//           } catch (error) {
//             if (isMounted) {
//               setAuthStatus('unauthenticated');
//               setUserRole(null);
//             }
//           }
//         } else {
//           if (isMounted) {
//             setAuthStatus('unauthenticated');
//             setUserRole(null);
//           }
//         }
//       }
//     );

//     // Immediate check for existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (!isMounted) return;
//       if (!session) {
//         setAuthStatus('unauthenticated');
//       }
//     });

//     return () => {
//       isMounted = false;
//       subscription?.unsubscribe();
//     };
//   }, []);

//   if (authStatus === 'loading') {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (authStatus === 'unauthenticated') {
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRole && userRole !== requiredRole) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
//           <p className="text-gray-600">You don't have permission to access this page.</p>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// };

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

// Define AdminRole type
type AdminRole = 'ADMIN' | 'SUPER_ADMIN';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AdminRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [userRole, setUserRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Check for existing session immediately
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) {
            setAuthStatus('unauthenticated');
          }
          return;
        }

        // Get user profile to check role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          if (isMounted) {
            setAuthStatus('unauthenticated');
          }
          return;
        }

        if (isMounted) {
          setUserRole(profile?.role as AdminRole || null);
          setAuthStatus('authenticated');
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (isMounted) {
          setAuthStatus('unauthenticated');
        }
      }
    };

    // Setup auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setAuthStatus('unauthenticated');
            setUserRole(null);
          }
          return;
        }

        if (!session?.user) {
          if (isMounted) {
            setAuthStatus('unauthenticated');
          }
          return;
        }

        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            if (isMounted) {
              setAuthStatus('unauthenticated');
            }
            return;
          }

          if (isMounted) {
            setUserRole(profile?.role as AdminRole || null);
            setAuthStatus('authenticated');
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          if (isMounted) {
            setAuthStatus('unauthenticated');
          }
        }
      }
    );

    // Run the check immediately
    checkSession();

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
