import { Component, inject, signal, OnDestroy, OnInit, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EspressoReadingStore } from '@boa/features/readings/application';
import { EspressoReading } from '@boa/features/readings/domain';
import { AuthStore } from '@boa/core-auth-application';
import { SupabaseService, Database } from '@boa/infra-util';

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
  private readonly route = inject(ActivatedRoute);

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

  coffeesList = signal<any[]>([]);
  workflowsList = signal<WorkflowRow[]>([]);
  setupsList = signal<SetupRow[]>([]);

  // Edit State
  readingId = signal<string | null>(null);
  isEditMode = computed(() => !!this.readingId());

  // Active targets computed signal
  selectedCoffeeTargets = computed(() => {
    const cid = this.coffeeId();
    if (!cid) return [];
    const coffee = this.coffeesList().find(c => c.id === cid);
    return coffee?.coffee_targets || [];
  });

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

    // Reactive default values for setup, workflow, warming shot, dose, and yield based on previous readings of the selected coffee
    effect(async () => {
      const cid = this.coffeeId();
      if (cid && !this.isEditMode()) {
        try {
          const { data: prev } = await this.supabaseService.client
            .from('espresso_readings')
            .select('*')
            .eq('coffee_id', cid)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          if (prev) {
            this.coffeeMassIn.set(Number(prev.coffee_mass_in));
            this.totalYield.set(Number(prev.total_yield));
            this.setupId.set(prev.setup_id);
            this.workflowId.set(prev.workflow_id);
            this.warmingShot.set(Boolean(prev.warming_shot));
          } else {
            this.coffeeMassIn.set(18.0);
            this.totalYield.set(36.0);
          }
        } catch (e) {
          console.error('Error loading previous reading defaults:', e);
        }
      }
    });
  }

  ngOnInit() {
    const user = this.authStore.user();
    if (user) {
      this.loadEntities(user.uid);
    }

    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        this.readingId.set(id);
        await this.loadReadingForEdit(id);
      }
    });
  }

  async loadReadingForEdit(id: string) {
    try {
      const { data: reading } = await this.supabaseService.client
        .from('espresso_readings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (reading) {
        this.coffeeId.set(reading.coffee_id);
        this.workflowId.set(reading.workflow_id);
        this.setupId.set(reading.setup_id);
        this.coffeeMassIn.set(Number(reading.coffee_mass_in));
        this.totalYield.set(Number(reading.total_yield));
        this.warmingShot.set(Boolean(reading.warming_shot));
        this.preinfusionTime.set(Number(reading.preinfusion_time));
        this.extractionTime.set(Number(reading.extraction_time));
        this.flavourBalance.set(reading.flavour_balance);
        this.rating.set(reading.rating);
        this.comments.set(reading.comments || '');
      }
    } catch (e) {
      console.error('Error loading reading for edit:', e);
    }
  }

  async loadEntities(uid: string) {
    try {
      const { data: coffees } = await this.supabaseService.client
        .from('coffees')
        .select('*, coffee_targets(*)')
        .eq('user_id', uid)
        .eq('active', true);
      if (coffees) {
        this.coffeesList.set(coffees);
      }

      const { data: workflows } = await this.supabaseService.client
        .from('workflows')
        .select('*')
        .eq('user_id', uid)
        .eq('active', true);
      if (workflows) {
        this.workflowsList.set(workflows);
      }

      const { data: setups } = await this.supabaseService.client
        .from('setups')
        .select('*')
        .eq('user_id', uid)
        .eq('active', true);
      if (setups) {
        this.setupsList.set(setups);
      }

      // Default logic for creation mode if no selection has been made yet
      if (!this.isEditMode() && !this.coffeeId()) {
        const { data: prev } = await this.supabaseService.client
          .from('espresso_readings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (prev) {
          this.coffeeId.set(prev.coffee_id);
          this.setupId.set(prev.setup_id);
          this.workflowId.set(prev.workflow_id);
          this.warmingShot.set(Boolean(prev.warming_shot));
          this.coffeeMassIn.set(Number(prev.coffee_mass_in));
          this.totalYield.set(Number(prev.total_yield));
        } else {
          // Fallback to first elements in lists if no previous readings exist at all
          if (coffees && coffees.length > 0) {
            this.coffeeId.set(coffees[0].id);
          }
          if (workflows && workflows.length > 0) {
            this.workflowId.set(workflows[0].id);
          }
          if (setups && setups.length > 0) {
            this.setupId.set(setups[0].id);
          }
        }
      }
    } catch (e) {
      console.error('Error loading defaults:', e);
    }
  }

  startTimer() {
    if (this.timerInterval) return;
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
    this.timerInterval = undefined;
    this.lapActive.set(true);
    this.startTime = Date.now();
    this.elapsedBeforePause = 0;
    this.startTimer();
  }

  pauseTimer() {
    if (!this.timerActive()) return;
    this.timerActive.set(false);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
    this.elapsedBeforePause += Date.now() - this.startTime;
  }

  resetTimer() {
    this.timerActive.set(false);
    this.lapActive.set(false);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
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
    const readingId = this.readingId() || crypto.randomUUID();

    // Calculate flow rate: totalYield / extractionTime (excludes preinfusion)
    let flowRate = 0;
    if (this.extractionTime() > 0) {
      flowRate = this.totalYield() / this.extractionTime();
    }

    const reading: EspressoReading = {
      id: readingId,
      userId,
      coffeeId: this.coffeeId(),
      workflowId: this.workflowId(),
      setupId: this.setupId(),
      coffeeMassIn: this.coffeeMassIn(),
      warmingShot: this.warmingShot(),
      preinfusionTime: this.preinfusionTime(),
      extractionTime: this.extractionTime(),
      totalYield: this.totalYield(),
      flowRate,
      flavourBalance: this.flavourBalance(),
      rating: this.rating(),
      comments: this.comments(),
      createdAt: new Date().toISOString(),
    };

    try {
      if (this.isEditMode()) {
        const { data: existing } = await this.supabaseService.client
          .from('espresso_readings')
          .select('created_at')
          .eq('id', readingId)
          .maybeSingle();
        if (existing) {
          reading.createdAt = existing.created_at;
        }
      }

      await this.store.addReading(reading);
      this.router.navigate(['/readings']);
    } catch (e) {
      console.error('Error saving reading:', e);
    }
  }
}
