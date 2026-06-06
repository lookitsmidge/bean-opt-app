import { Component, inject, signal, OnDestroy, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EspressoReadingStore } from '@boa/features/readings/application';
import { EspressoReading } from '@boa/features/readings/domain';
import { AuthStore } from '@boa/core-auth-application';
import { SupabaseService, Database } from '@boa/infra-util';

type CoffeeRow = Database['public']['Tables']['coffees']['Row'];
type WorkflowRow = Database['public']['Tables']['workflows']['Row'];
type SetupRow = Database['public']['Tables']['setups']['Row'];

@Component({
  selector: 'lib-new-reading',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-reading.component.html',
})
export class NewReadingComponent implements OnInit, OnDestroy {
  private readonly store = inject(EspressoReadingStore);
  private readonly authStore = inject(AuthStore);
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  // Form State
  coffeeMassIn = signal<number>(18.0);
  totalYield = signal<number>(36.0);
  warmingShot = signal<boolean>(false);
  comments = signal<string>('');
  flavourBalance = signal<number>(5);
  rating = signal<number>(4);

  // Relational Entities
  coffeeId = signal<string | null>(null);
  workflowId = signal<string | null>(null);
  setupId = signal<string | null>(null);

  coffeesList = signal<CoffeeRow[]>([]);
  workflowsList = signal<WorkflowRow[]>([]);
  setupsList = signal<SetupRow[]>([]);

  // Timer state
  preinfusionTime = signal<number>(0);
  extractionTime = signal<number>(0);
  lapActive = signal<boolean>(false); // false = preinfusion, true = extraction
  timerActive = signal<boolean>(false);
  private timerInterval: ReturnType<typeof setInterval> | undefined;

  private startTime = 0;
  private elapsedBeforePause = 0;

  constructor() {
    // Reload defaults if user changes/loads later
    effect(() => {
      const user = this.authStore.user();
      if (user) {
        this.loadEntities(user.uid);
      }
    });
  }

  ngOnInit() {
    const user = this.authStore.user();
    if (user) {
      this.loadEntities(user.uid);
    }
  }

  async loadEntities(uid: string) {
    try {
      const { data: coffees } = await this.supabaseService.client
        .from('coffees')
        .select('*')
        .eq('user_id', uid)
        .eq('active', true);
      if (coffees) {
        this.coffeesList.set(coffees);
        if (coffees.length > 0 && !this.coffeeId()) {
          this.coffeeId.set(coffees[0].id);
        }
      }

      const { data: workflows } = await this.supabaseService.client
        .from('workflows')
        .select('*')
        .eq('user_id', uid)
        .eq('active', true);
      if (workflows) {
        this.workflowsList.set(workflows);
        if (workflows.length > 0 && !this.workflowId()) {
          this.workflowId.set(workflows[0].id);
        }
      }

      const { data: setups } = await this.supabaseService.client
        .from('setups')
        .select('*')
        .eq('user_id', uid)
        .eq('active', true);
      if (setups) {
        this.setupsList.set(setups);
        if (setups.length > 0 && !this.setupId()) {
          this.setupId.set(setups[0].id);
        }
      }
    } catch (e) {
      console.error('Error loading defaults:', e);
    }
  }

  startTimer() {
    if (this.timerActive()) return;
    this.timerActive.set(true);
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime + this.elapsedBeforePause;
      const formatted = Math.round(elapsed / 100) / 10;
      if (!this.lapActive()) {
        this.preinfusionTime.set(formatted);
      } else {
        this.extractionTime.set(formatted);
      }
    }, 100);
  }

  lap() {
    if (!this.timerActive() || this.lapActive()) return;
    clearInterval(this.timerInterval);
    this.lapActive.set(true);
    this.startTime = Date.now();
    this.elapsedBeforePause = 0;
    this.startTimer();
  }

  pauseTimer() {
    if (!this.timerActive()) return;
    this.timerActive.set(false);
    clearInterval(this.timerInterval);
    this.elapsedBeforePause += Date.now() - this.startTime;
  }

  resetTimer() {
    this.timerActive.set(false);
    this.lapActive.set(false);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.preinfusionTime.set(0);
    this.extractionTime.set(0);
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
      coffeeId: this.coffeeId(),
      workflowId: this.workflowId(),
      setupId: this.setupId(),
      coffeeMassIn: this.coffeeMassIn(),
      warmingShot: this.warmingShot(),
      preinfusionTime: this.preinfusionTime(),
      extractionTime: this.extractionTime(),
      totalYield: this.totalYield(),
      flowRate: 0, // calculated in repository
      flavourBalance: this.flavourBalance(),
      rating: this.rating(),
      comments: this.comments(),
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
