import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; // Update import
import { 
  Bell, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Users, 
  MessageCircle,
  Book, 
  Youtube,
  Music,
  BookOpen,
  Search,
  Upload,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AdminManagementTab  from '@/components/AdminManagementTab';
import SundaySchoolTab from '@/components/SundaySchoolTab';

// Updated User type based on profiles table
interface User {
  id: string;
  role?: 'member' | 'ADMIN' | 'SUPER_ADMIN';
  email: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  profile_image_url?: string;
  home_address?: string;
  marital_status?: string;
  created_at: string;
  updated_at?: string;
  phone_number?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get user profile from Supabase
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }

          if (profileData) {
            setUser({
              id: profileData.id,
              role: profileData.role,
              email: profileData.email,
              first_name: profileData.first_name,
              middle_name: profileData.middle_name,
              last_name: profileData.last_name,
              profile_image_url: profileData.profile_image_url,
              home_address: profileData.home_address,
              marital_status: profileData.marital_status,
              created_at: profileData.created_at,
              updated_at: profileData.updated_at,
              phone_number: profileData.phone_number
            });
          }
        } else {
          setUser(null);
          navigate('/login');
        }
      }
    );

    // Initial check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) setUser(profileData);
      }
    };

    checkSession();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      navigate('/login');
    }
  };

  // Get user display name
  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.email || 'Anonymous';
  };

  // Get avatar initials
  const getAvatarInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    }
    return user?.email?.[0]?.toUpperCase() || 'AD';
  };

  // Mock data - replace with real data from Firebase
  const stats = {
    totalUsers: 2543,
    activeUsers: 1876,
    dailyDevotionals: 365,
    sermons: 156
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <img
              src="/api/placeholder/40/40"
              alt="Church Logo"
              className="h-8 w-8"
            />
            <h1 className="text-xl font-bold">Church Admin</h1>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <button className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                3
              </Badge>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile_image_url || ''} />
                  <AvatarFallback>{getAvatarInitials()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm">
                  <p className="font-medium">{getDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] border-r">
          <nav className="p-4 space-y-2">
            <button 
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <Info className="h-5 w-5" />
              <span>Overview</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                activeTab === 'users' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                activeTab === 'word' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('word')}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Word for the Day</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                activeTab === 'devotional' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('devotional')}
            >
              <Book className="h-5 w-5" />
              <span>Daily Devotional</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                activeTab === 'sermons' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('sermons')}
            >
              <Youtube className="h-5 w-5" />
              <span>Sermons</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                activeTab === 'audio' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('audio')}
            >
              <Music className="h-5 w-5" />
              <span>Audio Messages</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                activeTab === 'sunday-school' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('sunday-school')}
            >
              <BookOpen className="h-5 w-5" />
              <span>Sunday School</span>
            </button>
            {user?.role === 'SUPER_ADMIN' && (
              <button 
                className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                  activeTab === 'admin-management' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('admin-management')}
              >
                <Settings className="h-5 w-5" />
                <span>Admin Management</span>
              </button>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      +180 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      +20% engagement rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Daily Devotionals
                    </CardTitle>
                    <Book className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.dailyDevotionals}</div>
                    <p className="text-xs text-muted-foreground">
                      Published this year
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Sermons
                    </CardTitle>
                    <Youtube className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.sermons}</div>
                    <p className="text-xs text-muted-foreground">
                      Total uploaded
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>New sermon uploaded - "Walking in Faith"</span>
                      <span className="ml-auto text-sm text-muted-foreground">2m ago</span>
                    </div>
                    <Separator />
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Word for the Day updated</span>
                      <span className="ml-auto text-sm text-muted-foreground">1h ago</span>
                    </div>
                    <Separator />
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>15 new user registrations</span>
                      <span className="ml-auto text-sm text-muted-foreground">3h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Add other tab contents here */}
          {activeTab === 'sunday-school' && <SundaySchoolTab />}
          {activeTab === 'admin-management' && <AdminManagementTab />}
        </main>
      </div>
    </div>
  );
};


export default Dashboard;