import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToolHubsButton {
  id: string;
  icon: string;
  iconClass?: string;
}

@Component({
  selector: 'app-tool-hubs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-hubs.component.html',
  styleUrl: './tool-hubs.component.scss',
})
export class ToolHubsComponent {
  readonly primaryTools: ToolHubsButton[] = [
    { id: 'select', icon: 'near_me' },
    { id: 'pen', icon: 'edit' },
  ];

  readonly insertTools: ToolHubsButton[] = [
    { id: 'sticky-note', icon: 'sticky_note_2', iconClass: 'text-[#fde68a]' },
    { id: 'shapes', icon: 'category' },
    { id: 'text', icon: 'text_fields' },
    { id: 'link', icon: 'link' },
    { id: 'image', icon: 'image' },
    { id: 'code-snippet', icon: 'code' },
  ];

  readonly historyTools: ToolHubsButton[] = [
    { id: 'undo', icon: 'undo' },
    { id: 'redo', icon: 'redo' },
  ];

  activeToolId = 'select';

  selectTool(id: string) {
    this.activeToolId = id;
  }
}
