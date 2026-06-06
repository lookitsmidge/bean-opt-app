import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService } from '@boa/infra-util';
import { Workflow, WorkflowStep, IWorkflowRepository } from '@boa/features/equipment/domain';

@Injectable({
  providedIn: 'root',
})
export class SupabaseWorkflowRepository implements IWorkflowRepository {
  private supabase = inject(SupabaseService).client;

  getWorkflows(userId: string): Observable<Workflow[]> {
    return new Observable<Workflow[]>((subscriber) => {
      this.supabase
        .from('workflows')
        .select('*, workflow_steps(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(this.mapWorkflows(data || []));
        });
    });
  }

  getWorkflowById(id: string): Observable<Workflow | null> {
    return new Observable<Workflow | null>((subscriber) => {
      this.supabase
        .from('workflows')
        .select('*, workflow_steps(*)')
        .eq('id', id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(data ? this.mapWorkflow(data) : null);
        });
    });
  }

  async saveWorkflow(workflow: Workflow): Promise<void> {
    const { error } = await this.supabase
      .from('workflows')
      .upsert({
        id: workflow.id,
        user_id: workflow.userId,
        name: workflow.name,
        description: workflow.description,
        active: workflow.active,
        created_at: workflow.createdAt,
      });

    if (error) throw error;

    // If steps are provided, upsert them too
    if (workflow.steps && workflow.steps.length > 0) {
      for (const step of workflow.steps) {
        await this.saveWorkflowStep(step);
      }
    }
  }

  async deleteWorkflow(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('workflows')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async saveWorkflowStep(step: WorkflowStep): Promise<void> {
    const { error } = await this.supabase
      .from('workflow_steps')
      .upsert({
        id: step.id,
        workflow_id: step.workflowId,
        step_number: step.stepNumber,
        stage: step.stage,
        title: step.title,
        instructions: step.instructions,
        important: step.important,
        created_at: step.createdAt,
      });

    if (error) throw error;
  }

  async deleteWorkflowStep(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('workflow_steps')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapWorkflow(row: any): Workflow {
    const steps = (row.workflow_steps || [])
      .map((s: any) => ({
        id: s.id,
        workflowId: s.workflow_id,
        stepNumber: Number(s.step_number),
        stage: s.stage as 'Before' | 'During' | 'After',
        title: s.title || '',
        instructions: s.instructions || '',
        important: Boolean(s.important),
        createdAt: s.created_at,
      }))
      .sort((a: any, b: any) => a.stepNumber - b.stepNumber);

    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      active: Boolean(row.active),
      createdAt: row.created_at,
      steps,
    };
  }

  private mapWorkflows(rows: any[]): Workflow[] {
    return rows.map((row) => this.mapWorkflow(row));
  }
}
