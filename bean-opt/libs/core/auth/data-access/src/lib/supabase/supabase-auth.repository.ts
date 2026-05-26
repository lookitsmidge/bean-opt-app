import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from '@boa/infra-util';
import { AuthUser, IAuthRepository } from '@boa/core-auth-domain';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthRepository implements IAuthRepository {
  private supabase = inject(SupabaseService).client;

  authState(): Observable<AuthUser | null> {
    return new Observable<AuthUser | null>((subscriber) => {
      // 1. Initial state fetch
      this.supabase.auth.getUser()
        .then(async ({ data: { user }, error }) => {
          if (error) {
            console.warn('Supabase initial getUser failed (likely session expired):', error.message);
            subscriber.next(null);
            return;
          }

          if (!user) {
            subscriber.next(null);
            return;
          }

          // OPTIMISTIC: Emit user immediately with empty roles so app loads
          const initialUser = this.mapUserBasic(user);
          subscriber.next(initialUser);

          // ENHANCE: Fetch roles in background and re-emit
          this.fetchUserRoles(user.id).then(roles => {
            subscriber.next({ ...initialUser, roles, rolesLoaded: true });
          });
        })
        .catch(err => {
          console.error('Supabase getUser catastrophic failure:', err);
          subscriber.next(null);
        });

      // 2. Subscription to changes
      const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
        async (event, session) => {
          const user = session?.user ?? null;

          if (!user) {
            subscriber.next(null);
            return;
          }

          // OPTIMISTIC: Emit basic user
          const initialUser = this.mapUserBasic(user);
          subscriber.next(initialUser);

          // ENHANCE: Fetch roles
          this.fetchUserRoles(user.id).then(roles => {
            subscriber.next({ ...initialUser, roles, rolesLoaded: true });
          });
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    });
  }

  async loginWithGoogle(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  }

  async login(email: string, password: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async signUp(email: string, password: string, displayName: string, privacyPolicyAccepted: boolean): Promise<void> {
    const { error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          privacy_policy_accepted: privacyPolicyAccepted
        },
      },
    });
    if (error) throw error;
  }

  async continueAsGuest(): Promise<void> {
    const { error } = await this.supabase.auth.signInAnonymously();
    if (error) throw error;
  }

  async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async deleteAccount(): Promise<void> {
    throw new Error('Delete account not supported on client SDK. Requires Edge Function.');
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }

  async updateUserRole(uid: string, roleName: string): Promise<void> {
    const { data: role, error: roleError } = await this.supabase
      .from('app_roles')
      .select('id')
      .eq('role_name', roleName)
      .single();

    if (roleError) throw roleError;
    if (!role) throw new Error('Role not found');

    // Check if user already has this role
    const { data: existing, error: fetchError } = await this.supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', uid)
      .eq('role_id', (role as any).id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      // Toggle off: Delete the role
      const { error: deleteError } = await this.supabase
        .from('user_roles')
        .delete()
        .eq('user_id', uid)
        .eq('role_id', (role as any).id);
      if (deleteError) throw deleteError;
    } else {
      // Toggle on: Insert the role
      const { error: insertError } = await this.supabase
        .from('user_roles')
        .insert({ user_id: uid, role_id: (role as any).id });
      if (insertError) throw insertError;
    }
  }

  async searchUsers(query: string, page: number, pageSize: number, roleFilter?: string): Promise<{ users: any[], totalCount: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let supabaseQuery = this.supabase
      .from('profiles')
      .select(`
        *,
        user_roles!inner (
          app_roles!inner (
            role_name
          )
        )
      `, { count: 'exact' });

    if (query && query.trim() !== '') {
      supabaseQuery = supabaseQuery.or(`full_name.ilike.%${query}%,username.ilike.%${query}%`);
    }

    if (roleFilter && roleFilter !== 'all') {
      if (roleFilter === 'banned') {
        supabaseQuery = supabaseQuery.eq('is_banned', true);
      } else {
        supabaseQuery = supabaseQuery.eq('user_roles.app_roles.role_name', roleFilter);
      }
    }

    const { data, error, count } = await supabaseQuery
      .order('full_name', { ascending: true })
      .range(from, to);

    if (error) throw error;
    
    const users = (data || []).map((row: any) => ({
      uid: row.id,
      email: null, // Email is in auth.users, not public.profiles
      displayName: row.full_name,
      photoUrl: row.avatar_url,
      handle: row.username,
      isAnonymous: false,
      providerId: null,
      roles: row.user_roles?.map((ur: any) => ur.app_roles.role_name) || [],
      rolesLoaded: true,
      bio: row.bio,
      stats: { totalCollected: 0, followers: 0 },
      isBanned: row.is_banned ?? false
    }));

    return { users, totalCount: count || 0 };
  }

  async getUsersCountByRole(): Promise<Record<string, number>> {
    const { data: roleData, error: roleError } = await this.supabase
      .from('user_roles')
      .select('app_roles(role_name)');

    if (roleError) throw roleError;

    const { count: totalUsers, error: countError } = await this.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    const { count: bannedUsers, error: bannedError } = await this.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_banned', true);

    if (bannedError) throw bannedError;

    const counts: Record<string, number> = {
      total: totalUsers || 0,
      banned: bannedUsers || 0
    };

    (roleData as any[] || []).forEach(row => {
      const roleName = row.app_roles.role_name;
      counts[roleName] = (counts[roleName] || 0) + 1;
    });

    return counts;
  }

  async toggleUserBan(uid: string): Promise<void> {
    const { data: current, error: fetchError } = await this.supabase
      .from('profiles')
      .select('is_banned')
      .eq('id', uid)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await this.supabase
      .from('profiles')
      .update({ is_banned: !current.is_banned })
      .eq('id', uid);

    if (updateError) throw updateError;
  }

  async hardDeleteUser(uid: string): Promise<void> {
    const { error } = await this.supabase.rpc('delete_user_permanently', {
      target_user_id: uid
    });

    if (error) throw error;
  }

  private mapUserBasic(user: User): AuthUser {
    return {
      uid: user.id,
      email: user.email ?? null,
      displayName: user.user_metadata?.['display_name'] ?? user.user_metadata?.['full_name'] ?? null,
      photoUrl: user.user_metadata?.['avatar_url'] ?? null,
      handle: user.user_metadata?.['username'] ?? null,
      isAnonymous: user.is_anonymous ?? (user.app_metadata?.['provider'] === 'anonymous'),
      providerId: user.app_metadata?.['provider'] ?? null,
      roles: [],
      rolesLoaded: false,
      isBanned: false,
      privacyPolicyAcceptedAt: user.user_metadata?.['privacy_policy_accepted_at'] ?? null
    };
  }

  private async fetchUserRoles(userId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_roles')
        .select('app_roles(role_name)')
        .eq('user_id', userId);

      if (error) {
        console.warn('Background role fetch failed:', error.message);
        return [];
      }

      return (data as any[])?.map(r => r.app_roles.role_name) ?? [];
    } catch (e) {
      console.error('Exception during background role fetch:', e);
      return [];
    }
  }
}
