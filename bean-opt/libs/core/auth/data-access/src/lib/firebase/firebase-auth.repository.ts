import { inject, Injectable } from "@angular/core";
import { AuthUser, IAuthRepository } from "@boa/core-auth-domain";
import { FirebaseService } from "@boa/infra-util";
import {
    createUserWithEmailAndPassword,
    deleteUser,
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updatePassword,
    User
} from 'firebase/auth';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthRepository implements IAuthRepository {
    private firebase = inject(FirebaseService);

    authState(): Observable<AuthUser | null> {
        this.firebase.Init();
        const auth = getAuth();
        return new Observable<AuthUser | null>((subscriber) => {
            onAuthStateChanged(auth, (user) => {
                subscriber.next(this.mapUser(user));
            });
        });
    }

    async loginWithGoogle(): Promise<void> {
        this.firebase.Init();
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }

    async login(email: string, password: string): Promise<void> {
        this.firebase.Init();
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
    }

    async signUp(email: string, password: string, displayName: string, privacyPolicyAccepted: boolean): Promise<void> {
        this.firebase.Init();
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, email, password);
    }

    async continueAsGuest(): Promise<void> {
        this.firebase.Init();
        const auth = getAuth();
        await signInAnonymously(auth);
    }

    async logout(): Promise<void> {
        this.firebase.Init();
        const auth = getAuth();
        await signOut(auth);
    }

    async deleteAccount(): Promise<void> {
        this.firebase.Init();
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            await deleteUser(user);
        }
    }

    async updatePassword(newPassword: string): Promise<void> {
        this.firebase.Init();
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            await updatePassword(user, newPassword);
        }
    }

    async updateUserRole(uid: string, role: string): Promise<void> {
        throw new Error("Method not implemented in Firebase repository.");
    }

    async searchUsers(query: string, page: number, pageSize: number): Promise<{ users: any[], totalCount: number }> {
        throw new Error("Method not implemented in Firebase repository.");
    }

    async getUsersCountByRole(): Promise<Record<string, number>> {
        throw new Error("Method not implemented in Firebase repository.");
    }

    async toggleUserBan(uid: string): Promise<void> {
        throw new Error("Method not implemented in Firebase repository.");
    }

    async hardDeleteUser(uid: string): Promise<void> {
        throw new Error("Method not implemented in Firebase repository.");
    }

    private mapUser(user: User | null): AuthUser | null {
        if (!user) return null;
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL,
            handle: null,
            isAnonymous: user.isAnonymous,
            providerId: user.isAnonymous ? 'anonymous' : (user.providerData[0]?.providerId || 'password'),
            roles: [],
            rolesLoaded: true,
            isBanned: false,
            privacyPolicyAcceptedAt: null
        };
    }
}
