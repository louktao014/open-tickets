import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import {
  TicketFormModalComponent,
  TicketFormValue,
} from './ticket-form-modal/ticket-form-modal.component';
import { mockKanban } from '../../mock/kanban';
import { KanbanColumn, KanbanTicket } from '../../interface/kanban.interface';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent {
  constructor(private dialog: MatDialog) {}

  columns: KanbanColumn[] = mockKanban;

  onTicketDropped(event: CdkDragDrop<KanbanTicket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    const sourceColumn = this.columns.find(
      (column) => column.tickets === event.previousContainer.data,
    );
    const targetColumn = this.columns.find((column) => column.tickets === event.container.data);
    if (sourceColumn) {
      sourceColumn.count = sourceColumn.tickets.length;
    }
    if (targetColumn) {
      targetColumn.count = targetColumn.tickets.length;
    }
  }

  openAddTicketModal() {
    const dialogRef = this.dialog.open(TicketFormModalComponent, {
      panelClass: 'app-dialog-panel',
      width: '480px',
      maxWidth: '90vw',
      autoFocus: 'first-heading',
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.addTicket(value);
      }
    });
  }

  addTicket(value: TicketFormValue) {
    const todoColumn = this.columns.find((column) => column.id === 'todo');
    if (!todoColumn) {
      return;
    }

    const ticket: KanbanTicket = {
      id: this.generateTicketId(),
      title: value.title,
      detail: value.detail,
      priority: value.priority,
      createDate: value.createDate,
      updateDate: value.updateDate,
      assigneeAlt: value.assigneeAlt,
      taskType: value.taskType,
      jobType: value.jobType,
      meta: [{ icon: 'schedule', label: 'New' }],
      assigneeAvatarUrl: this.defaultAvatarUrl,
    };

    todoColumn.tickets.unshift(ticket);
    todoColumn.count = todoColumn.tickets.length;
  }

  private readonly defaultAvatarUrl =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238b919d'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 4-6 8-6s8 2 8 6'/></svg>";

  private generateTicketId(): string {
    const numericIds = this.columns
      .flatMap((column) => column.tickets)
      .map((ticket) => Number(ticket.id.replace(/[^0-9]/g, '')))
      .filter((value) => !Number.isNaN(value));
    const nextNumber = (numericIds.length ? Math.max(...numericIds) : 1000) + 1;
    return `DS-${nextNumber}`;
  }
}
