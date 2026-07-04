import { Component, HostListener, Input } from '@angular/core';
import { TextItem } from '../workspace.component';

export type TextResizeCorner = 'nw' | 'ne' | 'sw' | 'se';

const MIN_WIDTH = 80;
const MIN_HEIGHT = 32;

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [],
  templateUrl: './text.component.html',
  styleUrl: './text.component.scss',
})
export class TextComponent {
  @Input({ required: true }) item!: TextItem;
  @Input() zoom = 1;

  isEditing = false;

  private isResizing = false;
  private activeCorner: TextResizeCorner | null = null;
  private resizeStart = { x: 0, y: 0, width: 0, height: 0, itemX: 0, itemY: 0 };

  onContentInput(value: string) {
    this.item.content = value;
  }

  onTextMouseDown(event: MouseEvent) {
    if (this.isEditing) {
      event.stopPropagation();
    }
  }

  startEditing(textarea: HTMLTextAreaElement) {
    this.isEditing = true;
    queueMicrotask(() => textarea.focus());
  }

  stopEditing() {
    this.isEditing = false;
  }

  onResizeMouseDown(event: MouseEvent, corner: TextResizeCorner) {
    event.stopPropagation();
    event.preventDefault();

    this.isResizing = true;
    this.activeCorner = corner;
    this.resizeStart = {
      x: event.clientX,
      y: event.clientY,
      width: this.item.width,
      height: this.item.height,
      itemX: this.item.x,
      itemY: this.item.y,
    };
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent) {
    if (!this.isResizing || !this.activeCorner) {
      return;
    }

    const deltaX = (event.clientX - this.resizeStart.x) / this.zoom;
    const deltaY = (event.clientY - this.resizeStart.y) / this.zoom;

    const isLeft = this.activeCorner === 'nw' || this.activeCorner === 'sw';
    const isTop = this.activeCorner === 'nw' || this.activeCorner === 'ne';

    const nextWidth = Math.max(MIN_WIDTH, this.resizeStart.width + (isLeft ? -deltaX : deltaX));
    const nextHeight = Math.max(MIN_HEIGHT, this.resizeStart.height + (isTop ? -deltaY : deltaY));

    if (isLeft) {
      this.item.x = this.resizeStart.itemX + (this.resizeStart.width - nextWidth);
    }
    if (isTop) {
      this.item.y = this.resizeStart.itemY + (this.resizeStart.height - nextHeight);
    }

    this.item.width = nextWidth;
    this.item.height = nextHeight;
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp() {
    this.isResizing = false;
    this.activeCorner = null;
  }
}
