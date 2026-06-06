import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePasswordDialogComponent } from './update-password-dialog.component';

@Injectable({ providedIn: 'root' })
export class UpdatePasswordDialogService {
    private dialog = inject(MatDialog);

    async open(): Promise<string | null> {
        const dialogRef = this.dialog.open(UpdatePasswordDialogComponent, {
            maxWidth: '400px',
            width: '90vw',
        });
        return new Promise((resolve) => {
            dialogRef.afterClosed().subscribe((res) => resolve(res || null));
        });
    }
}
