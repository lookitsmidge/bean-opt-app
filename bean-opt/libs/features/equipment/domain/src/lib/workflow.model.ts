export interface WorkflowStep {
  id: string;
  workflowId: string;
  stepNumber: number;
  stage: 'Before' | 'During' | 'After';
  content: string;
  important: boolean;
  createdAt: string;
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  steps?: WorkflowStep[];
}
