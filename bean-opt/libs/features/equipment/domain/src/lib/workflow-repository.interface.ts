import { Observable } from 'rxjs';
import { Workflow, WorkflowStep } from './workflow.model';

export interface IWorkflowRepository {
  getWorkflows(userId: string): Observable<Workflow[]>;
  getWorkflowById(id: string): Observable<Workflow | null>;
  saveWorkflow(workflow: Workflow): Promise<void>;
  deleteWorkflow(id: string): Promise<void>;
  saveWorkflowStep(step: WorkflowStep): Promise<void>;
  deleteWorkflowStep(id: string): Promise<void>;
}
