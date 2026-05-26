import { inject, Injectable } from "@angular/core";
import { CollectorProfile, IProfileRepository } from "@boa/core-auth-domain";
import { FirebaseService } from "@boa/infra-util";
import { deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class FirebaseProfileRepository implements IProfileRepository {
    private firebase = inject(FirebaseService);

    private getProfileRef(uid: string) {
        return doc(this.firebase.db, 'artefacts', this.firebase.appId, 'users', uid, 'profile', 'metadata');
    }

    getProfile(uid: string): Observable<CollectorProfile | null> {
        return new Observable(subscriber => {
            this.firebase.Init();
            const ref = this.getProfileRef(uid);
            return onSnapshot(ref,
                (snapshot) => {
                    if (snapshot.exists()) {
                        subscriber.next(snapshot.data() as CollectorProfile);
                    } else {
                        subscriber.next(null);
                    }
                },
                (error) => subscriber.error(error)
            );
        });
    }

    async createProfile(profile: CollectorProfile): Promise<void> {
        this.firebase.Init();
        const ref = this.getProfileRef(profile.uid);
        await setDoc(ref, profile);
    }

    async isHandleAvailable(handle: string): Promise<boolean> {
        // Firebase is being deprecated, return true for now to avoid blocking
        return true;
    }

    async updateProfile(uid: string, updates: Partial<CollectorProfile>): Promise<void> {
        this.firebase.Init();
        const ref = this.getProfileRef(uid);
        await updateDoc(ref, updates);
    }

    async deleteProfile(uid: string): Promise<void> {
        this.firebase.Init();
        const ref = this.getProfileRef(uid);
        await deleteDoc(ref);
    }
}


