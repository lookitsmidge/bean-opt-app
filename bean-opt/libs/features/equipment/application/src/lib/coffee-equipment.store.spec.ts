import { TestBed } from '@angular/core/testing';
import { CoffeeEquipmentStore } from './coffee-equipment.store';
import { COFFEE_EQUIPMENT_REPOSITORY_TOKEN, CoffeeEquipmentRepositoryMock, CoffeeEquipment } from '@boa/features/equipment/domain';
import { of, throwError } from 'rxjs';

describe('CoffeeEquipmentStore', () => {
  let store: any;
  let repoMock: CoffeeEquipmentRepositoryMock;

  const mockEquipment: CoffeeEquipment = {
    id: 'equip-1',
    userId: 'user-1',
    name: 'IMS Basket',
    type: 'Basket',
    active: true,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    repoMock = new CoffeeEquipmentRepositoryMock();

    TestBed.configureTestingModule({
      providers: [
        CoffeeEquipmentStore,
        { provide: COFFEE_EQUIPMENT_REPOSITORY_TOKEN, useValue: repoMock },
      ],
    });

    store = TestBed.inject(CoffeeEquipmentStore);
  });

  it('should initialize with empty state', () => {
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load equipments successfully', () => {
    repoMock.getEquipments.mockReturnValue(of([mockEquipment]));

    store.loadEquipments('user-1');

    expect(repoMock.getEquipments).toHaveBeenCalledWith('user-1');
    expect(store.items()).toEqual([mockEquipment]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle load error', () => {
    repoMock.getEquipments.mockReturnValue(throwError(() => new Error('Failed to load')));

    store.loadEquipments('user-1');

    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('Failed to load');
  });

  it('should add equipment successfully', async () => {
    repoMock.saveEquipment.mockResolvedValue(undefined);

    await store.addEquipment(mockEquipment);

    expect(repoMock.saveEquipment).toHaveBeenCalledWith(mockEquipment);
    expect(store.items()).toEqual([mockEquipment]);
    expect(store.loading()).toBe(false);
  });

  it('should delete equipment successfully', async () => {
    repoMock.saveEquipment.mockResolvedValue(undefined);
    repoMock.deleteEquipment.mockResolvedValue(undefined);

    await store.addEquipment(mockEquipment);
    expect(store.items()).toEqual([mockEquipment]);

    await store.deleteEquipment(mockEquipment.id);

    expect(repoMock.deleteEquipment).toHaveBeenCalledWith(mockEquipment.id);
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
  });
});
