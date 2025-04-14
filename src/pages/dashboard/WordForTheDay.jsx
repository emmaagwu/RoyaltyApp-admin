import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, Edit } from 'lucide-react';

const WordForTheDay = () => {
  // Placeholder data
  const currentWord = {
    date: "April 14, 2025",
    verse: "Philippians 4:13",
    text: "I can do all things through Christ who strengthens me.",
    reflection: "This verse reminds us that with God's help, we can overcome any challenge. It's not about self-reliance, but about relying on God's power working through us."
  };

  const pastWords = [
    { id: 1, date: "April 13, 2025", verse: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want." },
    { id: 2, date: "April 12, 2025", verse: "John 3:16", text: "For God so loved the world that He gave His only begotten Son..." },
    { id: 3, date: "April 11, 2025", verse: "Proverbs 3:5-6", text: "Trust in the LORD with all your heart..." },
    { id: 4, date: "April 10, 2025", verse: "Romans 8:28", text: "And we know that in all things God works for the good..." }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Word for the Day</h2>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Update Today's Word
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Today's Word</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {currentWord.date}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{currentWord.verse}</h3>
            <blockquote className="pl-4 border-l-2 italic mt-2">
              "{currentWord.text}"
            </blockquote>
          </div>
          <div>
            <h4 className="font-medium mb-2">Reflection</h4>
            <p>{currentWord.reflection}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Previous Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastWords.map(word => (
              <div key={word.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{word.verse}</h4>
                  <span className="text-sm text-muted-foreground">{word.date}</span>
                </div>
                <p className="italic">"{word.text}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordForTheDay;