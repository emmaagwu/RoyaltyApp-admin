import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
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
  Info
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext'

// Updated User type based on profiles table
// interface User {
//   id: string;
//   role?: 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';
//   email: string;
//   first_name?: string;
//   middle_name?: string;
//   last_name?: string;
//   profile_image_url?: string;
//   home_address?: string;
//   marital_status?: string;
//   created_at: string;
//   updated_at?: string;
//   phone_number?: string;
// }

const DashboardLayout = () => {
  const { user, signOut } = useAuth(); 
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(); 
  };  

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.email || 'Anonymous';
  };
 

  const getAvatarInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    }
    return user?.email?.[0]?.toUpperCase() || 'AD';
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
            <NavLink 
              to="/overview"
              className={({ isActive }) => `flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <Info className="h-5 w-5" />
              <span>Overview</span>
            </NavLink>
            <NavLink 
              to="/users"
              className={({ isActive }) => `flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </NavLink>
            <NavLink 
              to="/word-for-the-day"
              className={({ isActive }) => `flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Word for the Day</span>
            </NavLink>
            <NavLink 
              to="/daily-devotional"
              className={({ isActive }) => `flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <Book className="h-5 w-5" />
              <span>Daily Devotional</span>
            </NavLink>
            <NavLink 
              to="/sermons"
              className={({ isActive }) => `flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <Youtube className="h-5 w-5" />
              <span>Sermons</span>
            </NavLink>
            <NavLink 
              to="/audio-messages"
              className={({ isActive }) => `flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <Music className="h-5 w-5" />
              <span>Audio Messages</span>
            </NavLink>
            <NavLink 
              to="/sunday-school"
              className={({ isActive }) => `flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Sunday School</span>
            </NavLink>
            {user?.role === 'SUPER_ADMIN' && (
              <NavLink 
                to="/admin-management"
                className={({ isActive }) => `flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Admin Management</span>
              </NavLink>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;