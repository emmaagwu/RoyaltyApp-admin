import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, Calendar, Upload, Eye, Clock } from 'lucide-react';

const Sermons = () => {
  // Placeholder data
  const recentSermons = [
    { 
      id: 1, 
      title: "Walking in Faith", 
      pastor: "Pastor John Smith", 
      date: "April 7, 2025", 
      duration: "43:21", 
      views: 1256,
      thumbnail: "/api/placeholder/320/180"
    },
    { 
      id: 2, 
      title: "The Power of Prayer", 
      pastor: "Pastor Mary Johnson", 
      date: "March 31, 2025", 
      duration: "38:45", 
      views: 982,
      thumbnail: "/api/placeholder/320/180"
    },
    { 
      id: 3, 
      title: "Finding Peace in Christ", 
      pastor: "Pastor David Williams", 
      date: "March 24, 2025", 
      duration: "47:12", 
      views: 1104,
      thumbnail: "/api/placeholder/320/180"
    },
    { 
      id: 4, 
      title: "Living with Purpose", 
      pastor: "Pastor John Smith", 
      date: "March 17, 2025", 
      duration: "41:37", 
      views: 876,
      thumbnail: "/api/placeholder/320/180"
    }
  ];

  const sermonStatistics = {
    total: 156,
    monthlyViews: 12453,
    totalViews: 286491,
    totalHours: 127
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sermons</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Sermon
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sermons</CardTitle>
            <Youtube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sermonStatistics.total}</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sermonStatistics.monthlyViews}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sermonStatistics.totalViews}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sermonStatistics.totalHours}h</div>
            <p className="text-xs text-muted-foreground">Of video content</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Sermons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentSermons.map(sermon => (
              <div key={sermon.id} className="border rounded-lg overflow-hidden">
                <img 
                  src={sermon.thumbnail} 
                  alt={sermon.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold">{sermon.title}</h4>
                  <p className="text-sm text-muted-foreground">{sermon.pastor}</p>
                  <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {sermon.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {sermon.duration}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground flex items-center">
                    <Eye className="mr-1 h-3 w-3" />
                    {sermon.views} views
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sermons;