import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Calendar, Edit, Eye, ThumbsUp } from 'lucide-react';

const DailyDevotional = () => {
  // Placeholder data
  const currentDevotional = {
    date: "April 14, 2025",
    title: "Finding Peace in Troubled Times",
    verse: "John 16:33",
    content: "In this world you will have trouble. But take heart! I have overcome the world.",
    devotional: "Jesus didn't promise a trouble-free life. In fact, He guaranteed we would face difficulties. Yet in the same breath, He reminds us that He has overcome the world. This means that through Him, we too can overcome any challenge that comes our way. Today, remember that no matter what troubles you face, you're on the winning side with Christ.",
    views: 543,
    likes: 128
  };

  const recentDevotionals = [
    { id: 1, date: "April 13, 2025", title: "Walking in Faith", views: 492, likes: 117 },
    { id: 2, date: "April 12, 2025", title: "The Power of Prayer", views: 601, likes: 142 },
    { id: 3, date: "April 11, 2025", title: "God's Unfailing Love", views: 478, likes: 103 },
    { id: 4, date: "April 10, 2025", title: "Strength in Weakness", views: 532, likes: 124 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Devotional</h2>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Create New Devotional
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{currentDevotional.title}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {currentDevotional.date}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{currentDevotional.verse}</h3>
            <blockquote className="pl-4 border-l-2 italic mt-2">
              "{currentDevotional.content}"
            </blockquote>
          </div>
          <div>
            <h4 className="font-medium mb-2">Devotional</h4>
            <p>{currentDevotional.devotional}</p>
          </div>
          <div className="flex items-center space-x-4 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              {currentDevotional.views} views
            </div>
            <div className="flex items-center">
              <ThumbsUp className="mr-1 h-4 w-4" />
              {currentDevotional.likes} likes
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Devotionals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDevotionals.map(devotional => (
              <div key={devotional.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{devotional.title}</h4>
                  <span className="text-sm text-muted-foreground">{devotional.date}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Eye className="mr-1 h-4 w-4" />
                    {devotional.views}
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    {devotional.likes}
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

export default DailyDevotional;