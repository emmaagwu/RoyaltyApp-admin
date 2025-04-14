import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Book, 
  Youtube, 
  Upload, 
  MessageCircle 
} from 'lucide-react';

const Overview = () => {
  // Mock data - replace with real data from API
  const stats = {
    totalUsers: 2543,
    activeUsers: 1876,
    dailyDevotionals: 365,
    sermons: 156
  };

  return (
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
  );
};

export default Overview;