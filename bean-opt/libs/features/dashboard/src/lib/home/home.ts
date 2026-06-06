import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthStore } from '@boa/core-auth-application'

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
  roastDate: Date;
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
export class HomeComponent {
  protected readonly auth = inject(AuthStore);
  today = new Date();

  // Mock logged-in user details
  user = this.auth.user;

  // Analytics stats
  totalShots = signal(38);
  activeBeansCount = signal(2);
  avgExtractionTime = signal(26.8);
  averageRating = signal(4.3);

  // Mock list of active beans in hopper
  activeBeans = signal<CoffeeBean[]>([
    {
      id: 'bean-1',
      name: 'Ethiopia Yirgacheffe',
      roaster: 'Origin Coffee Roasters',
      roastDate: new Date('2026-05-15'),
      roastLevel: 'Light',
      grindRange: '13.5 - 15.0',
      notes: 'Floral jasmine, blueberry, tea-like body',
      remainingGrams: 120
    },
    {
      id: 'bean-2',
      name: 'Guatemala Huehuetenango',
      roaster: 'Hasbean Roastery',
      roastDate: new Date('2026-05-10'),
      roastLevel: 'Medium',
      grindRange: '14.0 - 15.5',
      notes: 'Red apple, milk chocolate, maple sweetness',
      remainingGrams: 75
    }
  ]);

  // Mock recent extraction log
  recentShots = signal<ShotLog[]>([
    {
      id: 'shot-1',
      beanName: 'Ethiopia Yirgacheffe',
      roaster: 'Origin Coffee Roasters',
      grindSetting: '14.2',
      gramsIn: 18.0,
      gramsOut: 36.5,
      extractionTime: 27,
      rating: 5,
      tasteNotes: 'Stunning blueberry explosion, very clean jasmine finish.',
      createdAt: new Date('2026-05-25T08:12:00')
    },
    {
      id: 'shot-2',
      beanName: 'Guatemala Huehuetenango',
      roaster: 'Hasbean Roastery',
      grindSetting: '14.8',
      gramsIn: 18.0,
      gramsOut: 38.0,
      extractionTime: 24,
      rating: 3.5,
      tasteNotes: 'Slightly sour acidity, thin body. Need to grind finer.',
      createdAt: new Date('2026-05-24T15:30:00')
    },
    {
      id: 'shot-3',
      beanName: 'Ethiopia Yirgacheffe',
      roaster: 'Origin Coffee Roasters',
      grindSetting: '14.5',
      gramsIn: 18.2,
      gramsOut: 36.0,
      extractionTime: 29,
      rating: 4.5,
      tasteNotes: 'Balanced sweet orange, rich chocolate notes coming through.',
      createdAt: new Date('2026-05-24T09:05:00')
    }
  ]);

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
