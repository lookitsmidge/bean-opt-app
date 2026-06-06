import { ChangeDetectionStrategy, Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthStore } from '@boa/core-auth-application';
import { CoffeeStore } from '@boa/features/coffees/application';
import { EspressoReadingStore } from '@boa/features/readings/application';

export interface ShotLog {
  id: string;
  beanName: string;
  roaster: string;
  grindSetting: string;
  gramsIn: number;
  gramsOut: number;
  extractionTime: number; // in seconds
  rating: number; // 1-5 stars
  tasteNotes: string;
  createdAt: Date;
}

export interface CoffeeBean {
  id: string;
  name: string;
  roaster: string;
  roastDate: Date | null;
  roastLevel: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  grindRange: string;
  notes: string;
  remainingGrams: number;
}

@Component({
  selector: 'lib-home',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  protected readonly auth = inject(AuthStore);
  protected readonly coffeeStore = inject(CoffeeStore);
  protected readonly espressoStore = inject(EspressoReadingStore);

  today = new Date();

  // Logged-in user details
  user = this.auth.user;

  ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.coffeeStore.loadCoffees(user.uid);
      this.espressoStore.loadReadings(user.uid);
    }
  }

  // Analytics stats computed dynamically from stores
  totalShots = computed(() => this.espressoStore.items().length);
  activeBeansCount = computed(() => this.coffeeStore.items().filter((c) => c.active).length);

  avgExtractionTime = computed(() => {
    const items = this.espressoStore.items();
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, x) => acc + x.extractionTime, 0);
    return Math.round((sum / items.length) * 10) / 10;
  });

  averageRating = computed(() => {
    const items = this.espressoStore.items();
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, x) => acc + x.rating, 0);
    return Math.round((sum / items.length) * 10) / 10;
  });

  // Active beans mapped from active coffees in store
  activeBeans = computed<CoffeeBean[]>(() => {
    return this.coffeeStore.items()
      .filter((c) => c.active)
      .map((c) => ({
        id: c.id,
        name: c.name,
        roaster: c.roaster || 'Unknown Roaster',
        roastDate: null,
        roastLevel: c.roastProfile
          ? (c.roastProfile.charAt(0).toUpperCase() + c.roastProfile.slice(1)) as 'Light' | 'Medium' | 'Medium-Dark' | 'Dark'
          : 'Medium',
        grindRange: 'Dialed In',
        notes: c.description || c.notes || 'No description recorded.',
        remainingGrams: 250, // Default to a standard full bag weight
      }));
  });

  // Recent extractions mapped from espresso readings
  recentShots = computed<ShotLog[]>(() => {
    const readings = this.espressoStore.items();
    const coffees = this.coffeeStore.items();

    return [...readings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((r) => {
        const coffee = coffees.find((c) => c.id === r.coffeeId);
        return {
          id: r.id,
          beanName: coffee ? coffee.name : 'Unknown Beans',
          roaster: coffee?.roaster || 'Unknown Roaster',
          grindSetting: 'N/A', // Setups hold grinder settings; fallback for simplicity
          gramsIn: r.coffeeMassIn,
          gramsOut: r.totalYield,
          extractionTime: r.extractionTime,
          rating: r.rating,
          tasteNotes: r.comments || 'No comments.',
          createdAt: new Date(r.createdAt),
        };
      });
  });

  /**
   * Helper to generate array of rating stars
   */
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  /**
   * Helper to check if fractional star should be shown
   */
  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }
}
