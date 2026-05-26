import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService, Tables, TablesUpdate } from '@boa/infra-util';
import { CollectorProfile, IProfileRepository } from '@boa/core-auth-domain';

@Injectable({
  providedIn: 'root',
})
export class SupabaseProfileRepository implements IProfileRepository {
  private supabase = inject(SupabaseService).client;

  getProfile(uid: string): Observable<CollectorProfile | null> {
    return new Observable<CollectorProfile | null>((subscriber) => {
      // Initial fetch
      this.supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single()
        .then(({ data, error }) => {
          if (error && error.code !== 'PGRST116') { // PGRST116 is code for "no rows returned"
            subscriber.error(error);
            return;
          }
          subscriber.next(this.mapProfile(data as Tables<'profiles'>));
        });

      // Subscribe to real-time changes
      const channel = this.supabase
        .channel(`profile:${uid}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${uid}`,
          },
          (payload) => {
            subscriber.next(this.mapProfile(payload.new as Tables<'profiles'>));
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    });
  }

  async createProfile(profile: CollectorProfile): Promise<void> {
    const { error } = await this.supabase.from('profiles').insert({
      id: profile.uid,
      full_name: profile.displayName,
      username: profile.handle.toLowerCase(),
      avatar_url: profile.photoUrl,
      bio: profile.bio,
      updated_at: new Date().toISOString(),
      is_banned: profile.isBanned,
      privacy_policy_accepted_at: profile.privacyPolicyAcceptedAt,
    });
    if (error) throw error;
  }

  async isHandleAvailable(handle: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('username')
      .eq('username', handle.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    return !data;
  }

  async updateProfile(uid: string, updates: Partial<CollectorProfile>): Promise<void> {
    const rowUpdate: TablesUpdate<'profiles'> = {};
    if (updates.displayName !== undefined) rowUpdate.full_name = updates.displayName;
    if (updates.handle !== undefined) rowUpdate.username = updates.handle.toLowerCase();
    if (updates.photoUrl !== undefined) rowUpdate.avatar_url = updates.photoUrl;
    if (updates.bio !== undefined) rowUpdate.bio = updates.bio;
    if (updates.isBanned !== undefined) rowUpdate.is_banned = updates.isBanned;
    rowUpdate.updated_at = new Date().toISOString();

    const { error } = await this.supabase
      .from('profiles')
      .update(rowUpdate)
      .eq('id', uid);
    if (error) throw error;
  }

  async deleteProfile(uid: string): Promise<void> {
    const { error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', uid);
    if (error) throw error;
  }

  private mapProfile(row: Tables<'profiles'> | null): CollectorProfile | null {
    if (!row) return null;
    return {
      uid: row.id,
      displayName: row.full_name ?? '',
      handle: row.username ?? '',
      photoUrl: row.avatar_url ?? '',
      bio: row.bio ?? '',
      stats: {
        totalCollected: 0,
        followers: 0,
      },
      roles: [],
      isBanned: row.is_banned ?? false,
      privacyPolicyAcceptedAt: row.privacy_policy_accepted_at ?? null,
    };
  }
}
