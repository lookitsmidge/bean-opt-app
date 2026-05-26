import { Observable } from 'rxjs';
import { AuthUser } from './auth.model';

/** Interface for Dependancy Injection for the Auth implementation */
export interface IAuthRepository {
    /**
     * Observable of the current authenticated user
     */
    authState(): Observable<AuthUser | null>;

    /**
     * Log in with Google provider
     */
    loginWithGoogle(): Promise<void>;

    /**
     * Log in with email and password
     */
    login(email: string, password: string): Promise<void>;

    /**
     * Sign up with email, password and display name
     */
    signUp(email: string, password: string, displayName: string, privacyPolicyAccepted: boolean): Promise<void>;

    /**
     * Continue as a guest (anonymous authentication)
     */
    continueAsGuest(): Promise<void>;

    /**
     * Log out the current user
     */
    logout(): Promise<void>;

    /**
     * Delete the current authenticated account
     */
    deleteAccount(): Promise<void>;

    /**
     * Update the current users password
     * @param newPassword 
     */
    updatePassword(newPassword: string): Promise<void>;

    /**
     * Update a users role (Admin only)
     * @param uid The users ID
     * @param role The role to assign
     */
    updateUserRole(uid: string, role: string): Promise<void>;

    /**
     * Search for users (Admin only)
     * @param query The search term
     * @param page The page number (starting from 1)
     * @param pageSize The number of users per page
     * @param roleFilter Optional role to filter by
     */
    searchUsers(query: string, page: number, pageSize: number, roleFilter?: string): Promise<{ users: any[], totalCount: number }>;

    /**
     * Get counts of users by role (Admin only)
     */
    getUsersCountByRole(): Promise<Record<string, number>>;

    /**
     * Toggle a users ban status (Admin only)
     * @param uid The users ID
     */
    toggleUserBan(uid: string): Promise<void>;

    /**
     * Permanently delete a user account (Admin only)
     * @param uid The users ID
     */
    hardDeleteUser(uid: string): Promise<void>;
}
