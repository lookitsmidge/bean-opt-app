import { TestBed } from '@angular/core/testing';
import { WorkflowStore } from './workflow.store';
import { WORKFLOW_REPOSITORY_TOKEN, WorkflowRepositoryMock, Workflow } from '@boa/features/equipment/domain';
import { of, throwError } from 'rxjs';

describe('WorkflowStore', () => {
  let store: any;
  let repoMock: WorkflowRepositoryMock;

  const mockWorkflow: Workflow = {
    id: 'workflow-1',
    userId: 'user-1',
    name: 'Slayer Flow',
    description: 'Pre-brew profiling',
    steps: [
      {
        id: 'step-1',
        workflowId: 'workflow-1',
        stepNumber: 1,
        stage: 'Before',
        title: 'Flush',
        instructions: 'Run a warming shot',
        important: false,
        createdAt: new Date().toISOString(),
      }
    ],
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    repoMock = new WorkflowRepositoryMock();

    TestBed.configureTestingModule({
      providers: [
        WorkflowStore,
        { provide: WORKFLOW_REPOSITORY_TOKEN, useValue: repoMock },
      ],
    });

    store = TestBed.inject(WorkflowStore);
  });

  it('should initialize with empty state', () => {
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load workflows successfully', () => {
    repoMock.getWorkflows.mockReturnValue(of([mockWorkflow]));

    store.loadWorkflows('user-1');

    expect(repoMock.getWorkflows).toHaveBeenCalledWith('user-1');
    expect(store.items()).toEqual([mockWorkflow]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle load error', () => {
    repoMock.getWorkflows.mockReturnValue(throwError(() => new Error('Failed to load')));

    store.loadWorkflows('user-1');

    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('Failed to load');
  });

  it('should add workflow successfully', async () => {
    repoMock.saveWorkflow.mockResolvedValue(undefined);

    await store.addWorkflow(mockWorkflow);

    expect(repoMock.saveWorkflow).toHaveBeenCalledWith(mockWorkflow);
    expect(store.items()).toEqual([mockWorkflow]);
    expect(store.loading()).toBe(false);
  });

  it('should delete workflow successfully', async () => {
    repoMock.saveWorkflow.mockResolvedValue(undefined);
    repoMock.deleteWorkflow.mockResolvedValue(undefined);

    await store.addWorkflow(mockWorkflow);
    expect(store.items()).toEqual([mockWorkflow]);

    await store.deleteWorkflow(mockWorkflow.id);

    expect(repoMock.deleteWorkflow).toHaveBeenCalledWith(mockWorkflow.id);
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
  });
});
