import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { AuthStore } from '@boa/core-auth-application';
import { CoffeeStore } from '@boa/features/coffees/application';
import { EspressoReadingStore } from '@boa/features/readings/application';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const mockAuthStore = {
    user: signal({ uid: 'user-123', displayName: 'James' }),
  };

  const mockCoffeeStore = {
    items: signal([
      {
        id: 'coffee-1',
        name: 'Ethiopia Yirgacheffe',
        roaster: 'Origin',
        roastProfile: 'medium',
        description: 'Floral description',
        url: 'http://example.com',
        pricePerKg: 24.50,
        notes: 'Floral',
        active: true,
        createdAt: new Date().toISOString(),
      }
    ]),
    loadCoffees: vi.fn(),
  };

  const mockEspressoStore = {
    items: signal([
      {
        id: 'reading-1',
        userId: 'user-123',
        coffeeId: 'coffee-1',
        workflowId: null,
        setupId: null,
        coffeeMassIn: 18.0,
        warmingShot: false,
        preinfusionTime: 5.0,
        extractionTime: 27.0,
        totalYield: 36.0,
        flowRate: 1.33,
        flavourBalance: 5,
        rating: 4.5,
        comments: 'Excellent flavor',
        createdAt: new Date().toISOString(),
      }
    ]),
    loadReadings: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: CoffeeStore, useValue: mockCoffeeStore },
        { provide: EspressoReadingStore, useValue: mockEspressoStore },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call load methods on init', () => {
    component.ngOnInit();
    expect(mockCoffeeStore.loadCoffees).toHaveBeenCalledWith('user-123');
    expect(mockEspressoStore.loadReadings).toHaveBeenCalledWith('user-123');
  });

  it('should compute metrics correctly', () => {
    expect(component.totalShots()).toBe(1);
    expect(component.activeBeansCount()).toBe(1);
    expect(component.avgExtractionTime()).toBe(27.0);
    expect(component.averageRating()).toBe(4.5);
  });
});
