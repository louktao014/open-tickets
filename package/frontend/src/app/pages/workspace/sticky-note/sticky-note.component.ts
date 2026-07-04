import { Component, Input } from '@angular/core';
import { StickyNoteItem } from '../workspace.component';

@Component({
  selector: 'app-sticky-note',
  standalone: true,
  imports: [],
  templateUrl: './sticky-note.component.html',
  styleUrls: ['./sticky-note.component.scss'],
})
export class StickyNoteComponent {
  @Input({ required: true }) note!: StickyNoteItem;
  @Input() isDragging = false;

  get noteTransform(): string {
    return this.isDragging ? 'scale(1.05) rotate(0deg)' : `rotate(${this.note.rotation}deg)`;
  }
}
