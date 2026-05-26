export type AuthStatus = 'unauthenticated' | 'authenticated' | 'loading';
export type AuthMode = 'login' | 'signup';

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoUrl: string | null;
    handle: string | null;
    isAnonymous: boolean;
    providerId: string | null;
    roles: string[];
    rolesLoaded: boolean;
    isBanned: boolean;
    privacyPolicyAcceptedAt: string | null;
}

/**
 * Represents a user's profile in the WFI Vault app. It includes basic information about the user, such as their handle, display name, avatar, and bio.
 */
export interface CollectorProfile {
    /** Linked uid to the supabase auth */
    uid: string;
    /** Displayname (Grabbed from Google on Add (can be changed)) */
    displayName: string;
    /** The users handle */
    handle: string;
    /** The Photo Url from Google Account (or inputted one) */
    photoUrl: string;
    /** A short Bio for the user */
    bio: string;
    /** The users Statistics (updated as they go) */
    stats: {
        totalCollected: number;
        followers: number;
    };
    /** Roles assigned to the user */
    roles: string[];
    /** Whether the user is banned */
    isBanned: boolean;
    /** When the privacy policy was accepted */
    privacyPolicyAcceptedAt: string | null;
}
