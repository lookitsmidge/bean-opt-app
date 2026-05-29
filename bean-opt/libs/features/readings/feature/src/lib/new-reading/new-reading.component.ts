import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EspressoReadingStore } from '@boa/features/readings/application';
import { EspressoReading } from '@boa/features/readings/domain';
import { AuthStore } from '@boa/core-auth-application';

@Component({
  selector: 'lib-new-reading',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-reading.component.html',
})
export class NewReadingComponent implements OnDestroy {
  private readonly store = inject(EspressoReadingStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  // Form State
  coffeeMass = signal<number>(18.0);
  waterMass = signal<number>(36.0);
  notes = signal<string>('');

  // Timer state
  timerSeconds = signal<number>(0);
  timerActive = signal<boolean>(false);
  private timerInterval: any;

  private startTime = 0;
  private elapsedBeforePause = 0;

  startTimer() {
    if (this.timerActive()) return;
    this.timerActive.set(true);
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime + this.elapsedBeforePause;
      this.timerSeconds.set(Math.round(elapsed / 100) / 10);
    }, 100);
  }

  pauseTimer() {
    if (!this.timerActive()) return;
    this.timerActive.set(false);
    clearInterval(this.timerInterval);
    this.elapsedBeforePause += Date.now() - this.startTime;
  }

  resetTimer() {
    this.timerActive.set(false);
    clearInterval(this.timerInterval);
    this.timerSeconds.set(0);
    this.startTime = 0;
    this.elapsedBeforePause = 0;
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  async saveReading() {
    const user = this.authStore.user();
    const userId = user ? user.uid : 'anonymous';

    const newReading: EspressoReading = {
      id: crypto.randomUUID(),
      userId,
      coffeeMass: this.coffeeMass(),
      waterMass: this.waterMass(),
      extractionTime: this.timerSeconds(),
      notes: this.notes() || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      await this.store.addReading(newReading);
      this.router.navigate(['/readings']);
    } catch (e) {
      console.error('Error saving reading:', e);
    }
  }
}
