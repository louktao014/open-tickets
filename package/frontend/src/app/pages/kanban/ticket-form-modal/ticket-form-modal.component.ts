import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { KanbanPriority } from '../kanban.component';

export interface TicketFormValue {
  title: string;
  detail: string;
  priority: KanbanPriority;
  createDate: string;
  updateDate: string;
  assigneeAlt: string;
  taskType: string;
  jobType: string;
}

const TODAY = new Date().toISOString().slice(0, 10);

@Component({
  selector: 'app-ticket-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-form-modal.component.html',
  styleUrl: './ticket-form-modal.component.scss',
})
export class TicketFormModalComponent {
  readonly priorities: KanbanPriority[] = ['Low', 'Med', 'High', 'Urgent'];
  readonly taskTypes = ['Feature', 'Bug', 'Chore', 'Improvement'];
  readonly jobTypes = ['Frontend', 'Backend', 'DevOps', 'QA', 'Design'];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TicketFormModalComponent, TicketFormValue>,
  ) {
    this.form = this.fb.group({
      title: this.fb.control('', [Validators.required, Validators.maxLength(120)]),
      detail: this.fb.control('', [Validators.maxLength(2000)]),
      priority: this.fb.control<KanbanPriority>('Low', [Validators.required]),
      createDate: this.fb.control(TODAY, [Validators.required]),
      updateDate: this.fb.control(TODAY, [Validators.required]),
      assigneeAlt: this.fb.control('', [Validators.required, Validators.maxLength(80)]),
      taskType: this.fb.control(this.taskTypes[0], [Validators.required]),
      jobType: this.fb.control(this.jobTypes[0], [Validators.required]),
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue() as TicketFormValue);
  }
}
