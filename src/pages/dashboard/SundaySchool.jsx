import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Upload, Users, Calendar, Clock } from 'lucide-react';

const SundaySchool = () => {
  // Placeholder data
  const currentLesson = {
    date: "April 14, 2025",
    title: "The Parables of Jesus",
    scripture: "Matthew 13:1-23",
    description: "This lesson explores the meaning and significance of Jesus' parables, focusing on the Parable of the Sower.",
    materials: ["Teacher's Guide", "Student Workbook", "Visual Aids"]
  };
  
  const upcomingLessons = [
    { 
      id: 1, 
      date: "April 21, 2025", 
      title: "The Sermon on the Mount", 
      scripture: "Matthew 5-7" 
    },
    { 
      id: 2, 
      date: "April 28, 2025", 
      title: "The Lord's Prayer", 
      scripture: "Matthew 6:9-13" 
    },
    { 
      id: 3, 
      date: "May 5, 2025", 
      title: "The Miracles of Jesus", 
      scripture: "Various passages" 
    }
  ];

  const classStats = {
    totalClasses: 12,
    totalStudents: 187,
    averageAttendance: 142
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sunday School</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Materials
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classStats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classStats.averageAttendance}</div>
            <p className="text-xs text-muted-foreground">76% attendance rate</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Current Lesson</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {currentLesson.date}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{currentLesson.title}</h3>
            <p className="text-sm text-muted-foreground">Scripture: {currentLesson.scripture}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p>{currentLesson.description}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Materials</h4>
            <ul className="list-disc pl-5">
              {currentLesson.materials.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingLessons.map(lesson => (
              <div key={lesson.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{lesson.title}</h4>
                  <p className="text-sm text-muted-foreground">Scripture: {lesson.scripture}</p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  {lesson.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SundaySchool;