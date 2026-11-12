import { createClient } from '@supabase/supabase-js';
import { UserPreferences, UserProfile } from '../types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    rawUrl &&
    rawAnonKey &&
    !rawUrl.includes('your-project') &&
    !rawAnonKey.includes('your-anon-key') &&
    rawUrl.startsWith('https://')
  );
};

// Safe fallback credentials so createClient doesn't throw during startup
const supabaseUrl = isSupabaseConfigured() ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured() ? rawAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * ==========================================
 * Database Services for DriveAI User Data
 * ==========================================
 */

// 1. User Profiles
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetchUserProfile error:', error.message);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from('profiles').upsert({
      id: profile.id,
      email: profile.email,
      full_name: profile.fullName,
      avatar_url: profile.avatarUrl,
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.warn('Supabase upsertUserProfile error:', error.message);
    }
  } catch (err) {
    console.error('Error upserting user profile:', err);
  }
}

// 2. Favorites
export async function fetchUserFavorites(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('car_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchUserFavorites error:', error.message);
      return [];
    }
    return data ? data.map((item: { car_id: string }) => item.car_id) : [];
  } catch (err) {
    console.error('Error fetching user favorites:', err);
    return [];
  }
}

export async function addUserFavorite(userId: string, carId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from('user_favorites').upsert(
      {
        user_id: userId,
        car_id: carId
      },
      { onConflict: 'user_id,car_id' }
    );
    if (error) {
      console.warn('Supabase addUserFavorite error:', error.message);
    }
  } catch (err) {
    console.error('Error adding user favorite:', err);
  }
}

export async function removeUserFavorite(userId: string, carId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('car_id', carId);

    if (error) {
      console.warn('Supabase removeUserFavorite error:', error.message);
    }
  } catch (err) {
    console.error('Error removing user favorite:', err);
  }
}

// 3. Compare List
export async function fetchUserComparisons(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('user_comparisons')
      .select('car_ids')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetchUserComparisons error:', error.message);
      return [];
    }
    return data && Array.isArray(data.car_ids) ? data.car_ids : [];
  } catch (err) {
    console.error('Error fetching comparisons:', err);
    return [];
  }
}

export async function saveUserComparisons(userId: string, carIds: string[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from('user_comparisons').upsert(
      {
        user_id: userId,
        car_ids: carIds,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    );
    if (error) {
      console.warn('Supabase saveUserComparisons error:', error.message);
    }
  } catch (err) {
    console.error('Error saving user comparisons:', err);
  }
}

// 4. Preferences
export async function fetchUserPreferences(userId: string): Promise<UserPreferences | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetchUserPreferences error:', error.message);
      return null;
    }
    return data ? (data.preferences as UserPreferences) : null;
  } catch (err) {
    console.error('Error fetching preferences:', err);
    return null;
  }
}

export async function saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from('user_preferences').upsert(
      {
        user_id: userId,
        preferences,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    );
    if (error) {
      console.warn('Supabase saveUserPreferences error:', error.message);
    }
  } catch (err) {
    console.error('Error saving user preferences:', err);
  }
}
