import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UpdatePasswordDialogService {
    isOpen = signal(false);

    private resolverFn: ((value: string | null) => void) | null = null;

    async open(): Promise<string | null> {
        this.isOpen.set(true);
        return new Promise((resolve) => {
            this.resolverFn = resolve;
        });
    }

    close(result: string | null = null) {
        this.isOpen.set(false);
        this.resolverFn?.(result);
        this.resolverFn = null;
    }
}
