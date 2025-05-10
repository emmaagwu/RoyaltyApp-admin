import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, UserCog, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) throw userError;

        setUser(userData);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Could not load user information. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return '';
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return '-';
    return role.charAt(0) + role.slice(1).toLowerCase().replace('_', ' ');
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate('/users');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Users
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-48" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">{error || 'User not found'}</p>
        <Button onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Users
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              {user.profile_image_url ? (
                <AvatarImage src={user.profile_image_url} alt={`${user.first_name} ${user.last_name}`} />
              ) : null}
              <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">
              {user.first_name} {user.middle_name ? `${user.middle_name} ` : ''}{user.last_name}
            </h2>
            <div className="flex items-center mt-1 text-muted-foreground">
              <UserCog className="h-4 w-4 mr-1" />
              <span>{formatRole(user.role)}</span>
            </div>
            {user.phone_number && (
              <div className="flex items-center mt-4">
                <Phone className="h-4 w-4 mr-2" />
                <span>{user.phone_number}</span>
              </div>
            )}
            {user.home_address && (
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{user.home_address}</span>
              </div>
            )}
            <div className="flex items-center mt-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        {/* User Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                <dd>
                  {user.first_name} {user.middle_name ? `${user.middle_name} ` : ''}{user.last_name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
                <dd>{user.gender || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone Number</dt>
                <dd>{user.phone_number || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Marital Status</dt>
                <dd>{user.marital_status ? user.marital_status.charAt(0).toUpperCase() + user.marital_status.slice(1).toLowerCase() : '-'}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Home Address</dt>
                <dd>{user.home_address || '-'}</dd>
              </div>
            </dl>
            <Separator className="my-6" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailPage;
