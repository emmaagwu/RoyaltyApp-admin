import React, { useMemo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Types
interface MembershipNumber {
  year: number;
  membership_number: number;
}

interface User {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  profile_image_url?: string;
  role: string;
  created_at: string;
  phone_number?: string;
  membership_numbers?: MembershipNumber[];
}

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
}

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  pagination: PaginationProps;
  onPageChange: (page: number) => void;
  onUserClick: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  pagination,
  onPageChange,
  onUserClick,
}) => {
  const { page, pageSize, totalCount } = pagination;
  
  // Calculate total pages efficiently using useMemo
  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);
  
  // Get user's initial for avatar fallback
  const getUserInitials = (user: User) => {
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role.charAt(0) + role.slice(1).toLowerCase().replace('_', ' ');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get membership number display - memoized to avoid recalculation
  const getMembershipNumber = (user: User) => {
    if (!user.membership_numbers || user.membership_numbers.length === 0) {
      return '-';
    }
    
    // Find the most recent membership number
    const latestMembership = user.membership_numbers.reduce(
      (latest, current) => (current.year > latest.year ? current : latest),
      user.membership_numbers[0]
    );
    
    return `${latestMembership.year}/${latestMembership.membership_number.toString().padStart(4, '0')}`;
  };

  // Pagination controls
  const handlePrevPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  // Calculate pagination display information
  const paginationInfo = useMemo(() => {
    const start = Math.min((page - 1) * pageSize + 1, totalCount);
    const end = Math.min(page * pageSize, totalCount);
    return { start, end };
  }, [page, pageSize, totalCount]);

  // Create page numbers for pagination
  const pageNumbers = useMemo(() => {
    const visiblePages = 5; // Number of page numbers to show
    let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);
    
    // Adjust startPage if endPage is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [page, totalPages]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No users found matching your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Membership #</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onUserClick(user.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      {user.profile_image_url ? (
                        <AvatarImage src={user.profile_image_url} alt={`${user.first_name} ${user.last_name}`} />
                      ) : null}
                      <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.first_name} {user.middle_name ? `${user.middle_name} ` : ''}{user.last_name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getMembershipNumber(user)}</TableCell>
                <TableCell>{formatRole(user.role)}</TableCell>
                <TableCell>{user.phone_number || '-'}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between px-2 mt-4">
        <div className="text-sm text-muted-foreground mb-2 md:mb-0">
          Showing {paginationInfo.start} to {paginationInfo.end} of {totalCount} users
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          
          {/* Show first page if not in view */}
          {pageNumbers[0] > 1 && (
            <>
              <Button
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(1)}
              >
                1
              </Button>
              {pageNumbers[0] > 2 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
            </>
          )}
          
          {/* Show page numbers */}
          {pageNumbers.map(pageNum => (
            <Button
              key={pageNum}
              variant={page === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          ))}
          
          {/* Show last page if not in view */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
              <Button
                variant={page === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;