import { Observable } from 'rxjs';
import { CollectorProfile } from './auth.model';

/** Interface for Dependancy Injection for the Profile implementation */
export interface IProfileRepository {
    /**
     * Get a user's profile by uid. Returns an observable for real-time updates.
     */
    getProfile(uid: string): Observable<CollectorProfile | null>;

    /**
     * Check if a handle is available for a user
     */
    isHandleAvailable(handle: string): Promise<boolean>;

    /**
     * Create a new profile for a user
     */
    createProfile(profile: CollectorProfile): Promise<void>;

    /**
     * Update an existing profile
     */
    updateProfile(uid: string, updates: Partial<CollectorProfile>): Promise<void>;

    /**
     * Delete a profile and associated data
     */
    deleteProfile(uid: string): Promise<void>;
}
