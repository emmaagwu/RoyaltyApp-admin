import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Upload, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface OutlineItem {
  id: string;
  title: string;
  date: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

const SundaySchoolTab = () => {
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outlines, setOutlines] = useState<OutlineItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing outlines
  useEffect(() => {
    fetchOutlines();
  }, []);

  const fetchOutlines = async () => {
    try {
      const { data, error } = await supabase
        .from('sundaySchoolOutlines')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      setOutlines(data || []);
    } catch (error) {
      console.error('Error fetching outlines:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch outlines. Please try again.",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File size must be less than 5MB",
        });
        return;
      }
      // Check file type
      if (!file.type.includes('pdf') && !file.type.includes('word')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Only PDF and Word documents are allowed",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!title || !selectedDate || !selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sunday-school')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('sunday-school')
        .getPublicUrl(fileName);

      // Save metadata to Supabase
      const { error: insertError } = await supabase
        .from('sundaySchoolOutlines')
        .insert({
          title,
          date: format(selectedDate, 'yyyy-MM-dd'),
          fileName: selectedFile.name,
          fileUrl: publicUrl,
          uploadedAt: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Reset form
      setTitle('');
      setSelectedDate(undefined);
      setSelectedFile(null);
      
      // Refresh outlines list
      await fetchOutlines();
      
      toast({
        title: "Success",
        description: "Outline uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading outline:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload outline. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (outline: OutlineItem) => {
    try {
      // Extract the file path from the URL
      const filePathMatch = outline.fileUrl.match(/sunday-school\/(.+)$/);
      if (!filePathMatch) throw new Error('Invalid file URL');

      // Delete file from Storage
      const { error: deleteStorageError } = await supabase.storage
        .from('sunday-school')
        .remove([filePathMatch[1]]);

      if (deleteStorageError) throw deleteStorageError;

      // Delete metadata from Supabase
      const { error: deleteRecordError } = await supabase
        .from('sundaySchoolOutlines')
        .delete()
        .eq('id', outline.id);

      if (deleteRecordError) throw deleteRecordError;

      // Refresh outlines list
      await fetchOutlines();

      toast({
        title: "Success",
        description: "Outline deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting outline:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete outline. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sunday School Outlines</h2>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Outline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              type="text"
              placeholder="Enter outline title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date</label>
            <div className="mt-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">File</label>
            <div className="mt-1">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Max file size: 5MB. Accepted formats: PDF, Word
              </p>
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={isUploading || !title || !selectedDate || !selectedFile}
            className="w-full"
          >
            {isUploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Outline
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Outlines List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Outlines</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outlines.map((outline) => (
                <TableRow key={outline.id}>
                  <TableCell>{outline.title}</TableCell>
                  <TableCell>{format(new Date(outline.date), 'PPP')}</TableCell>
                  <TableCell className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    {outline.fileName}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(outline.fileUrl)}
                      >
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(outline)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {outlines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No outlines uploaded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SundaySchoolTab;