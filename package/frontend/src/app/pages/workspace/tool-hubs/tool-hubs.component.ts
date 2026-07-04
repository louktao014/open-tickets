import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumWorkspaceItemType } from '../../../enum/workspace.enum';

export interface ToolHubsButton {
  id: string;
  icon: string;
  iconClass?: string;
}

export interface StickyNoteColorOption {
  id: string;
  label: string;
  bgColor: string;
  textColor: string;
}

export type InsertableWorkspaceItemType =
  | EnumWorkspaceItemType.StickyNote
  | EnumWorkspaceItemType.Text
  | EnumWorkspaceItemType.Link
  | EnumWorkspaceItemType.CodeSnippet;

export interface InsertToolEvent {
  type: InsertableWorkspaceItemType;
  color?: StickyNoteColorOption;
}

const STICKY_NOTE_COLOR_OPTIONS: StickyNoteColorOption[] = [
  { id: 'amber', label: 'Amber', bgColor: '#fde68a', textColor: '#451a03' },
  { id: 'green', label: 'Green', bgColor: '#bbf7d0', textColor: '#064e3b' },
  { id: 'orange', label: 'Orange', bgColor: '#fed7aa', textColor: '#7c2d12' },
  { id: 'blue', label: 'Blue', bgColor: '#bfdbfe', textColor: '#1e3a8a' },
  { id: 'pink', label: 'Pink', bgColor: '#fbcfe8', textColor: '#831843' },
  { id: 'violet', label: 'Violet', bgColor: '#ddd6fe', textColor: '#4c1d95' },
];

const INSERTABLE_TOOL_TYPES: ReadonlySet<string> = new Set([
  EnumWorkspaceItemType.Text,
  EnumWorkspaceItemType.Link,
  EnumWorkspaceItemType.CodeSnippet,
]);

@Component({
  selector: 'app-tool-hubs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-hubs.component.html',
  styleUrl: './tool-hubs.component.scss',
})
export class ToolHubsComponent {
  @Output() insertItem = new EventEmitter<InsertToolEvent>();

  readonly EnumWorkspaceItemType = EnumWorkspaceItemType;
  readonly stickyNoteColorOptions = STICKY_NOTE_COLOR_OPTIONS;

  readonly primaryTools: ToolHubsButton[] = [
    { id: 'select', icon: 'near_me' },
    { id: 'pen', icon: 'edit' },
  ];

  readonly insertTools: ToolHubsButton[] = [
    { id: EnumWorkspaceItemType.StickyNote, icon: 'sticky_note_2', iconClass: 'text-[#fde68a]' },
    { id: 'shapes', icon: 'category' },
    { id: EnumWorkspaceItemType.Text, icon: 'text_fields' },
    { id: EnumWorkspaceItemType.Link, icon: 'link' },
    { id: EnumWorkspaceItemType.Image, icon: 'image' },
    { id: EnumWorkspaceItemType.CodeSnippet, icon: 'code' },
  ];

  readonly historyTools: ToolHubsButton[] = [
    { id: 'undo', icon: 'undo' },
    { id: 'redo', icon: 'redo' },
  ];

  activeToolId = 'select';
  isStickyNoteColorPickerOpen = false;

  selectTool(id: string) {
    this.activeToolId = id;
  }

  onInsertToolClick(tool: ToolHubsButton) {
    if (tool.id === EnumWorkspaceItemType.StickyNote) {
      this.activeToolId = tool.id;
      this.isStickyNoteColorPickerOpen = !this.isStickyNoteColorPickerOpen;
      return;
    }

    this.isStickyNoteColorPickerOpen = false;
    this.activeToolId = tool.id;

    if (INSERTABLE_TOOL_TYPES.has(tool.id)) {
      this.insertItem.emit({ type: tool.id as InsertableWorkspaceItemType });
    }
  }

  chooseStickyNoteColor(color: StickyNoteColorOption) {
    this.isStickyNoteColorPickerOpen = false;
    this.activeToolId = 'select';
    this.insertItem.emit({ type: EnumWorkspaceItemType.StickyNote, color });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isStickyNoteColorPickerOpen) {
      return;
    }

    const target = event.target as HTMLElement;
    if (!target.closest('.tool-hubs')) {
      this.isStickyNoteColorPickerOpen = false;
    }
  }
}
