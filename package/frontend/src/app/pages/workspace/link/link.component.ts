import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LinkItem } from '../../../interface/workspace.interface';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
})
export class LinkComponent {
  @Input({ required: true }) item!: LinkItem;
  @ViewChild('titleInput') titleInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('editFields') editFieldsRef?: ElementRef<HTMLDivElement>;

  isEditing = false;

  startEditing() {
    this.isEditing = true;
    queueMicrotask(() => this.titleInputRef?.nativeElement.focus());
  }

  stopEditing() {
    this.isEditing = false;
  }

  onFieldsFocusOut(event: FocusEvent) {
    const nextFocus = event.relatedTarget as HTMLElement | null;
    if (!nextFocus || !this.editFieldsRef?.nativeElement.contains(nextFocus)) {
      this.stopEditing();
    }
  }

  onTitleInput(value: string) {
    this.item.title = value;
  }

  onUrlInput(value: string) {
    this.item.url = value;
  }
}
