// src/utils/supabaseUtils.js

/**
 * A utility function to fetch users with filters, pagination, and sorting
 * @param {Object} options - Query options
 * @param {number} options.page - Current page number (starts at 1)
 * @param {number} options.pageSize - Number of records per page
 * @param {string} options.role - Filter by role (optional)
 * @param {string} options.searchQuery - Search text (optional)
 * @param {string} options.tab - Current tab (all, active, new)
 * @param {string} options.sortBy - Field to sort by
 * @param {boolean} options.sortAsc - Sort in ascending order if true
 * @returns {Promise} - Resolves to { data, count, error }
 */
export const fetchUsersByFilter = async ({
  page = 1,
  pageSize = 20,
  role = '',
  searchQuery = '',
  tab = 'all',
  sortBy = 'created_at',
  sortAsc = false
}) => {
  try {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        membership_numbers(year, membership_number)
      `, { count: 'exact' });

    // Apply role filter if selected
    if (role) {
      query = query.eq('role', role);
    }

    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(
        `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`
      );
    }

    // Apply tab filters
    if (tab === 'active') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gt('updated_at', thirtyDaysAgo.toISOString());
    } else if (tab === 'new') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gt('created_at', thirtyDaysAgo.toISOString());
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortAsc });
    
    // Execute the query with pagination
    return await query.range(from, to);
  } catch (error) {
    console.error('Error in fetchUsersByFilter:', error);
    return { data: [], count: 0, error };
  }
};

/**
 * Fetch user statistics
 * @returns {Promise} - Resolves to { totalUsers, activeUsers, newUsers, error }
 */
export const fetchUserStats = async () => {
  try {
    // Get total users count
    const { count: totalUsers, error: totalError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Get active users (those who have logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: activeUsers, error: activeError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('updated_at', thirtyDaysAgo.toISOString());

    if (activeError) throw activeError;

    // Get new users (registered in the last 30 days)
    const { count: newUsers, error: newError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('created_at', thirtyDaysAgo.toISOString());

    if (newError) throw newError;

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      newUsers: newUsers || 0,
      error: null
    };
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      error
    };
  }
};

/**
 * Fetch detailed user information by ID
 * @param {string} userId - The user's ID
 * @returns {Promise} - Resolves to { userData, membershipData, error }
 */
export const fetchUserDetails = async (userId) => {
  try {
    // Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    
    // Fetch membership history
    const { data: membershipData, error: membershipError } = await supabase
      .from('membership_numbers')
      .select(`
        year,
        membership_number,
        assigned_at,
        assigned_by:users(id, email)
      `)
      .eq('profile_id', userId)
      .order('year', { ascending: false });

    if (membershipError) throw membershipError;

    return {
      userData,
      membershipData: membershipData || [],
      error: null
    };
  } catch (error) {
    console.error('Error fetching user details:', error);
    return {
      userData: null,
      membershipData: [],
      error
    };
  }
};