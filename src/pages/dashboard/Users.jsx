// 

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users as UsersIcon,
  Search,
  UserCheck,
  UserPlus,
  Filter,
} from 'lucide-react';
import UserTable from '@/components/UserTable';
import { Button } from '@/components/ui/button';
import useDebounce from '@/hooks/useDebounce';

// // Types
// const userStats = {
//   totalUsers: number;
//   activeUsers: number;
//   newUsers: number;
// }

const UsersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalCount: 0,
  });
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    searchQuery: '',
  });
  
  // Debounce the search query to prevent excessive database calls
  const debouncedSearchQuery = useDebounce(searchInput, 500);
  
  // Update the filters when the debounced search query changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, searchQuery: debouncedSearchQuery }));
    // Reset to first page when search changes
    if (debouncedSearchQuery !== filters.searchQuery) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [debouncedSearchQuery]);

  // Fetch user statistics
  const fetchUserStats = useCallback(async () => {
    try {
      // Get total users count
      const { count: totalUsers, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (those who have logged in within the last 30 days)
      // Note: You might need to adjust this based on how you track active users
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsers, error: activeError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('updated_at', thirtyDaysAgo.toISOString());

      // Get new users (registered in the last 30 days)
      const { count: newUsers, error: newError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('created_at', thirtyDaysAgo.toISOString());

      if (totalError || activeError || newError) {
        console.error('Error fetching user stats:', totalError || activeError || newError);
        return;
      }

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        newUsers: newUsers || 0,
      });
    } catch (error) {
      console.error('Error fetching user statistics:', error);
    }
  }, []);

  // Fetch users with pagination and filters
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          membership_numbers(year, membership_number)
        `, { count: 'exact' });

      // Apply role filter if selected
      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      // Apply search filter if provided
      if (filters.searchQuery) {
        query = query.or(
          `first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,phone_number.ilike.%${filters.searchQuery}%`
        );
      }

      // Apply tab filters
      if (activeTab === 'active') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gt('updated_at', thirtyDaysAgo.toISOString());
      } else if (activeTab === 'new') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gt('created_at', thirtyDaysAgo.toISOString());
      }

      // Apply pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      setUsers(data || []);
      setPagination(prev => ({ ...prev, totalCount: count || 0 }));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when changing tabs
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleRoleFilterChange = (value) => {
    setFilters(prev => ({ ...prev, role: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters({ role: '', searchQuery: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Users Management</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users (Month)</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Joined in the last 30 days</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>User Directory</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filters.role} onValueChange={handleRoleFilterChange}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROLES">All Roles</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                {(filters.searchQuery || filters.role) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all" >All Users</TabsTrigger>
              <TabsTrigger value="active">Active Users</TabsTrigger>
              <TabsTrigger value="new">New Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <UserTable 
                users={users}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onUserClick={handleUserClick}
              />
            </TabsContent>
            
            <TabsContent value="active" className="m-0">
              <UserTable 
                users={users}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onUserClick={handleUserClick}
              />
            </TabsContent>
            
            <TabsContent value="new" className="m-0">
              <UserTable 
                users={users}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onUserClick={handleUserClick}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;