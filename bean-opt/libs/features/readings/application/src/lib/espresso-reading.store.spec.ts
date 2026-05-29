import { TestBed } from '@angular/core/testing';
import { EspressoReadingStore } from './espresso-reading.store';
import { ESPRESSO_READING_REPOSITORY_TOKEN, EspressoReadingRepositoryMock } from '@boa/features/readings/domain';

describe('EspressoReadingStore', () => {
  let store: any;
  let repoMock: EspressoReadingRepositoryMock;

  beforeEach(() => {
    repoMock = new EspressoReadingRepositoryMock();

    TestBed.configureTestingModule({
      providers: [
        EspressoReadingStore,
        { provide: ESPRESSO_READING_REPOSITORY_TOKEN, useValue: repoMock },
      ],
    });

    store = TestBed.inject(EspressoReadingStore);
  });

  it('should initialize with empty state', () => {
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });
});
