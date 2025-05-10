import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Edit, Save, Eye, Clock, ArrowLeft, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MDXEditor } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import ReactMarkdown from 'react-markdown';

// Only admin and super_admin can add/edit words
const WordForTheDay = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editorTab, setEditorTab] = useState('write');
  const [markdownContent, setMarkdownContent] = useState('');

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      scripture_reference: '',
      is_published: true
    }
  });

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setIsAdmin(['ADMIN', 'SUPER_ADMIN'].includes(data.role));
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  // Fetch words data
  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        // Get today's word first
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: todayWord, error: todayError } = await supabase
          .from('daily_words')
          .select('*')
          .eq('is_published', true)
          .lte('published_at', new Date().toISOString())
          .order('published_at', { ascending: false })
          .limit(1);

        if (todayError) throw todayError;
        
        // Get previous words
        const { data: pastWords, error: pastError } = await supabase
          .from('daily_words')
          .select('*')
          .eq('is_published', true)
          .lte('published_at', new Date().toISOString())
          .order('published_at', { ascending: false })
          .range(1, 10); // Skip today's word and get the next 10

        if (pastError) throw pastError;

        if (todayWord && todayWord.length > 0) {
          setCurrentWord(todayWord[0]);
        }
        
        setWords(pastWords || []);
      } catch (error) {
        console.error('Error fetching daily words:', error);
        toast.error('Failed to load daily words');
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const onSubmit = async (data) => {
    try {
      const wordData = {
        ...data,
        content: markdownContent || data.content,
        author_id: user.id,
        published_at: new Date().toISOString(),
      };

      const { data: result, error } = await supabase
        .from('daily_words')
        .insert([wordData])
        .select();

      if (error) throw error;

      toast.success('Word for the day published successfully!');
      setIsEditing(false);
      
      // Update the current word
      if (result && result.length > 0) {
        setCurrentWord(result[0]);
        
        // Move the previous current word to the words list
        if (currentWord) {
          setWords([currentWord, ...words.slice(0, -1)]);
        }
      }

      // Reset the form
      reset();
      setMarkdownContent('');
    } catch (error) {
      console.error('Error publishing word:', error);
      toast.error('Failed to publish word for the day');
    }
  };

  const handlePreview = () => {
    setPreviewContent(markdownContent || watch('content'));
    setIsPreviewOpen(true);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditorTab('write');
    setMarkdownContent('');
    
    if (!isEditing) {
      reset({
        title: '',
        content: '',
        scripture_reference: '',
        is_published: true
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Word for the Day</h2>
        {isAdmin && (
          <Button onClick={handleEditToggle}>
            {isEditing ? (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to View
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add New Word
              </>
            )}
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Word for the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title (Optional)
                </label>
                <Input
                  id="title"
                  placeholder="Enter a title"
                  {...register('title')}
                />
              </div>

              <div>
                <label htmlFor="scripture_reference" className="block text-sm font-medium mb-1">
                  Scripture Reference
                </label>
                <Input
                  id="scripture_reference"
                  placeholder="e.g., John 3:16"
                  {...register('scripture_reference', { required: "Scripture reference is required" })}
                />
                {errors.scripture_reference && (
                  <p className="text-sm text-red-500 mt-1">{errors.scripture_reference.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <Tabs value={editorTab} onValueChange={setEditorTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="p-0 border rounded-md mt-2">
                    <div className="min-h-[200px]">
                      <MDXEditor
                        markdown={markdownContent}
                        onChange={setMarkdownContent}
                        contentEditableClassName="prose max-w-none p-4 min-h-[200px] outline-none"
                        placeholder="Write the word for today here... (use markdown for formatting)"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="border rounded-md p-4 prose max-w-none min-h-[200px] mt-2">
                    {markdownContent ? (
                      <ReactMarkdown>{markdownContent}</ReactMarkdown>
                    ) : (
                      <p className="text-muted-foreground">Nothing to preview</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleEditToggle}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Full Preview
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>
                <Save className="mr-2 h-4 w-4" />
                Publish
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <>
          {/* Today's Word */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Today's Word</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {currentWord ? formatDate(currentWord.published_at) : "No word for today yet"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p>Loading today's word...</p>
              ) : currentWord ? (
                <div>
                  {currentWord.title && (
                    <h3 className="text-lg font-bold mb-2">{currentWord.title}</h3>
                  )}
                  <h4 className="font-semibold">{currentWord.scripture_reference}</h4>
                  <div className="mt-4 prose max-w-none">
                    <ReactMarkdown>{currentWord.content}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <p>No word for today has been published yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Previous Words */}
          <Card>
            <CardHeader>
              <CardTitle>Previous Words</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading previous words...</p>
              ) : words.length > 0 ? (
                <div className="space-y-4">
                  {words.map(word => (
                    <div key={word.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          {word.title && (
                            <h3 className="font-bold">{word.title}</h3>
                          )}
                          <h4 className="font-medium">{word.scripture_reference}</h4>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatDate(word.published_at)}</span>
                      </div>
                      <div className="mt-2 prose max-w-none">
                        <ReactMarkdown>{word.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No previous words found.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Word Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            {watch('title') && (
              <h3 className="text-xl font-bold">{watch('title')}</h3>
            )}
            <h4 className="font-semibold">{watch('scripture_reference')}</h4>
            <div className="prose max-w-none">
              <ReactMarkdown>{previewContent}</ReactMarkdown>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WordForTheDay;