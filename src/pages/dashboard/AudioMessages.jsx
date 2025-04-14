import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Upload, Play, Clock, Calendar, Headphones } from 'lucide-react';

const AudioMessages = () => {
  // Placeholder data
  const recentAudios = [
    { 
      id: 1, 
      title: "Understanding the Beatitudes", 
      speaker: "Pastor John Smith", 
      date: "April 8, 2025", 
      duration: "28:14", 
      plays: 387 
    },
    { 
      id: 2, 
      title: "Spiritual Disciplines", 
      speaker: "Elder Sarah Davis", 
      date: "April 1, 2025", 
      duration: "32:40", 
      plays: 294 
    },
    { 
      id: 3, 
      title: "Faith in Action", 
      speaker: "Minister Thomas Brown", 
      date: "March 25, 2025", 
      duration: "24:53", 
      plays: 341 
    },
    { 
      id: 4, 
      title: "The Lord's Prayer Explained", 
      speaker: "Pastor John Smith", 
      date: "March 18, 2025", 
      duration: "36:12", 
      plays: 423 
    },
    { 
      id: 5, 
      title: "Walking with the Holy Spirit", 
      speaker: "Elder Rebecca Wilson", 
      date: "March 11, 2025", 
      duration: "29:45", 
      plays: 308 
    }
  ];

  const audioStats = {
    total: 124,
    monthlyPlays: 3845,
    totalPlays: 86231
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Audio Messages</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Audio
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audios</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audioStats.total}</div>
            <p className="text-xs text-muted-foreground">+6 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Plays</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audioStats.monthlyPlays}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audioStats.totalPlays}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Audio Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAudios.map(audio => (
              <div key={audio.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                    <Music className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{audio.title}</h4>
                    <p className="text-sm text-muted-foreground">{audio.speaker}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end text-sm text-muted-foreground">
                  <div className="flex items-center mb-1">
                    <Calendar className="mr-1 h-4 w-4" />
                    {audio.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {audio.duration}
                  </div>
                  <div className="flex items-center mt-1">
                    <Headphones className="mr-1 h-4 w-4" />
                    {audio.plays} plays
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

export default AudioMessages;