// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '@/lib/supabase'; // Update your supabase client import
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';

//   const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   // Check admin access in Supabase profiles table
//   const checkAdminAccess = async (userId: string) => {
//     // Destructure and rename error for clarity
//     const { data, error: queryError } = await supabase
//       .from('profiles')
//       .select('role')
//       .eq('id', userId)
//       .single();

//     // Handle query errors
//     if (queryError) {
//       console.error('Role check error:', queryError);
//       return false;
//     }

//     // Handle missing data case
//     if (!data) {
//       console.warn('No profile found for user:', userId);
//       return false;
//     }

//     return ['ADMIN', 'SUPER_ADMIN'].includes(data.role);
//   };

//   const handleEmailLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     console.log("Logining into the admin panel")
    
//     try {
//       console.log("About to call supabase.auth.signInWithPassword");
//       // Supabase email/password login
//       const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password
//       });

//       console.log("Sign in response:", data, error);

//       if (error) {
//         setError(error.message);
//         return;
//       }

//       if (!data.user) {
//         setError('No user found');
//         return;
//       }

//       const hasAdminAccess = await checkAdminAccess(data.user.id);
//       console.log("Admin Access Check:", hasAdminAccess);
      
//       if (!hasAdminAccess) {
//         await supabase.auth.signOut();
//         setError('You do not have admin access');
//         return;
//       }
      
//       navigate('/');
//     } catch (err) {
//       setError('Login failed');
//       console.log(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setIsLoading(true);
//     setError('');
    
//     try {
//       // Supabase Google OAuth
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//         options: {
//           redirectTo: window.location.origin // Update if using different redirect
//         }
//       });

//       if (error) {
//         setError(error.message);
//         return;
//       }

//       // For OAuth, we need to get the session after redirect
//       const { data: sessionData } = await supabase.auth.getSession();

//       if (!sessionData.session?.user) {
//         setError('Google login failed');
//         return;
//       }

//       const hasAdminAccess = await checkAdminAccess(sessionData.session.user.id);
      
//       if (!hasAdminAccess) {
//         await supabase.auth.signOut();
//         setError('You do not have admin access');
//         return;
//       }
      
//       navigate('/');
//     } catch (err) {
//       setError('Google sign-in failed');
//       console.log(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ... rest of your component (JSX remains similar)

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Left side with logo */}
//       <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
//         <div className="max-w-md text-center">
//           <img
//             src="/api/placeholder/200/200"
//             alt="Church Logo"
//             className="mx-auto mb-8"
//           />
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">
//             Royalty Assembly
//           </h1>
//           <p className="text-gray-600">
//             Admin Dashboard Portal
//           </p>
//         </div>
//       </div>

//       {/* Right side with login form */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-md space-y-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold tracking-tight">
//               Welcome back
//             </h2>
//             <p className="mt-2 text-gray-600">
//               Please sign in to your admin account
//             </p>
//           </div>

//           <form onSubmit={handleEmailLogin} className="mt-8 space-y-6">
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="mt-1"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="mt-1"
//                   required
//                 />
//               </div>
//             </div>

//             {error && (
//               <Alert variant="destructive" className="mt-4">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <div className="space-y-4">
//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Signing in...' : 'Sign in'}
//               </Button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-gray-50 text-gray-500">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full"
//                 onClick={handleGoogleLogin}
//                 disabled={isLoading}
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                   <path
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     fill="#4285F4"
//                   />
//                   <path
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     fill="#34A853"
//                   />
//                   <path
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     fill="#FBBC05"
//                   />
//                   <path
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     fill="#EA4335"
//                   />
//                 </svg>
//                 Sign in with Google
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signInWithPassword, signInWithOAuth, loading } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithPassword(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithOAuth('google');
      // OAuth redirect will re-trigger AuthProvider listener
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img src="/api/placeholder/200/200" alt="Church Logo" className="mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Royalty Assembly</h1>
          <p className="text-gray-600">Admin Dashboard Portal</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-gray-600">Please sign in to your admin account</p>
          </div>

          <form onSubmit={handleEmailLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
                {/* Google SVG Icon */}
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  {/* paths omitted for brevity */}
                </svg>
                Sign in with Google
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
