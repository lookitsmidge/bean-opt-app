import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EspressoReadingStore } from '@boa/features/readings/application';
import { AuthStore } from '@boa/core-auth-application';

@Component({
  selector: 'lib-readings-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './readings-list.component.html',
})
export class ReadingsListComponent implements OnInit {
  protected readonly store = inject(EspressoReadingStore);
  private readonly authStore = inject(AuthStore);

  ngOnInit() {
    const user = this.authStore.user();
    if (user) {
      this.store.loadReadings(user.uid);
    }
  }

  constructor() {
    effect(() => {
      const user = this.authStore.user();
      if (user) {
        this.store.loadReadings(user.uid);
      }
    });
  }

  deleteReading(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this shot run?')) {
      this.store.deleteReading(id);
    }
  }

  getRatio(dose: number, yieldG: number): string {
    if (!dose) return '0.0';
    return (yieldG / dose).toFixed(2);
  }
}
