import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StickyNoteComponent } from './sticky-note/sticky-note.component';
import { UploadedImageComponent } from './uploaded-image/uploaded-image.component';
import { CodeSnippetComponent } from './code-snippet/code-snippet.component';
import { TextComponent } from './text/text.component';
import { LinkComponent } from './link/link.component';
import { ToolHubsComponent } from './tool-hubs/tool-hubs.component';

export type CanvasItemType = 'sticky-note' | 'image' | 'code-snippet' | 'text' | 'link';

export interface CanvasItemBase {
  id: string;
  type: CanvasItemType;
  x: number;
  y: number;
  zIndex: number;
}

export interface StickyNoteItem extends CanvasItemBase {
  type: 'sticky-note';
  label: string;
  content: string;
  bgColor: string;
  textColor: string;
  rotation: number;
  icon: string;
}

export interface UploadedImageItem extends CanvasItemBase {
  type: 'image';
  fileName: string;
  imageUrl: string;
  imageAlt: string;
  width: number;
  height: number;
  statusIcon: string;
  statusIconClass: string;
  grayscaleHover: boolean;
}

export interface CodeSnippetItem extends CanvasItemBase {
  type: 'code-snippet';
  fileName: string;
  code: string;
}

export interface TextItem extends CanvasItemBase {
  type: 'text';
  content: string;
  fontSize: number;
  color: string;
  width: number;
  height: number;
}

export interface LinkItem extends CanvasItemBase {
  type: 'link';
  url: string;
  title: string;
}

export type WorkspaceCanvasItem =
  | StickyNoteItem
  | UploadedImageItem
  | CodeSnippetItem
  | TextItem
  | LinkItem;

export interface Whiteboard {
  id: string;
  name: string;
  items: WorkspaceCanvasItem[];
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;
const MINIMAP_WORLD_WIDTH = 2000;
const MINIMAP_WORLD_HEIGHT = 1400;

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    StickyNoteComponent,
    UploadedImageComponent,
    CodeSnippetComponent,
    TextComponent,
    LinkComponent,
    ToolHubsComponent,
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
export class WorkspaceComponent {
  @ViewChild('viewport', { static: true }) viewportRef!: ElementRef<HTMLDivElement>;
  @ViewChild('miniMap', { static: true }) miniMapRef!: ElementRef<HTMLDivElement>;

  zoom = 1;
  panX = 0;
  panY = 0;

  whiteboards: Whiteboard[] = [
    {
      id: 'sprint-12',
      name: 'Sprint 12 Board',
      items: [
        {
          id: 'note-1',
          type: 'sticky-note',
          x: 400,
          y: 200,
          zIndex: 1,
          label: 'USER_STORY_12',
          content: 'As a developer, I need an automated deployment pipeline for microservices.',
          bgColor: '#fde68a',
          textColor: '#451a03',
          rotation: -2,
          icon: 'person',
        },
        {
          id: 'note-2',
          type: 'sticky-note',
          x: 650,
          y: 150,
          zIndex: 2,
          label: 'DONE',
          content: 'Integrate unit tests into CI flow with GitHub Actions.',
          bgColor: '#bbf7d0',
          textColor: '#064e3b',
          rotation: 1,
          icon: 'check_circle',
        },
        {
          id: 'note-3',
          type: 'sticky-note',
          x: 520,
          y: 420,
          zIndex: 3,
          label: 'BLOCKED',
          content: 'Terraform state lock issues on S3 bucket. Investigation needed.',
          bgColor: '#fed7aa',
          textColor: '#7c2d12',
          rotation: -1,
          icon: 'warning',
        },
        {
          id: 'note-4',
          type: 'sticky-note',
          x: 800,
          y: 450,
          zIndex: 4,
          label: 'ARCH_REVIEW',
          content: 'Move to Redis for session management in Alpha-2.',
          bgColor: '#bfdbfe',
          textColor: '#1e3a8a',
          rotation: 3,
          icon: 'layers',
        },
        {
          id: 'image-1',
          type: 'image',
          x: 1000,
          y: 180,
          zIndex: 5,
          fileName: 'infra-diagram-v2.png',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCKrEtNBNn0HOwMOm9ODtexEve7Zbom66W5B1v8-ZY-tCUQE0-VJzd1fqJWpe1mJQCrNfNhMiMsigItb4RdBq33mZ5Xt3NlChN-MtefaZ56KTQhSqnR51Lku_B_fIAnL45y5gnmR_HLThy6XuqLcMj1A_5jHCWraAYSL8GkkF-y7lZwlovgyaCd5XxakqE9M_TnDvu-JZoxbJyUsgwkqVaCWX146vV9FgXQm5-aHJlnqYOtnvaHtqL84zuZLKwIf_C7mrhbrVeirfyO',
          imageAlt: 'infra diagram',
          width: 320,
          height: 200,
          statusIcon: 'download',
          statusIconClass: 'text-primary',
          grayscaleHover: true,
        },
        {
          id: 'image-2',
          type: 'image',
          x: 1100,
          y: 480,
          zIndex: 6,
          fileName: 'k8s-logs-crash.jpg',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ99B7a-u-9MMVSF2zY5r-A_8I6eskDqzfbfrw5i6Ac78gFoSdPbwH1Vv7hIc-fcO6_jWiIJz8l7YmUwhhYQjp3f-v052879fFF_gl_cnIie2pcpUqwCo4AqX3UAYJByNmyws8_NOqVZ86kze1qqk9seQD4eMVPXnCABMkQzKG07xhI3sHdzjrLkzW6lurhYINLyeFE8BXArFvMuoPjvM-jpwNa1zgMLiF-0UKTxUZLfWuI_KPYXoBcr68fmBRLl9ruLbDSyXJcEto',
          imageAlt: 'k8s logs',
          width: 240,
          height: 300,
          statusIcon: 'warning',
          statusIconClass: 'text-error',
          grayscaleHover: false,
        },
        {
          id: 'code-1',
          type: 'code-snippet',
          x: 100,
          y: 400,
          zIndex: 7,
          fileName: 'deploy.py',
          code: 'import os\ndef deploy():\n    print("Starting...")\n    os.system("terraform apply")\n# End of script',
        },
        {
          id: 'text-1',
          type: 'text',
          x: 550,
          y: 700,
          zIndex: 8,
          content: 'Deployment Pipeline Overview',
          fontSize: 24,
          color: '#dfe2eb',
          width: 280,
          height: 60,
        },
        {
          id: 'link-1',
          type: 'link',
          x: 850,
          y: 820,
          zIndex: 9,
          title: 'Deployment runbook',
          url: 'https://github.com',
        },
      ],
    },
    {
      id: 'retro',
      name: 'Retro Board',
      items: [
        {
          id: 'retro-note-1',
          type: 'sticky-note',
          x: 300,
          y: 200,
          zIndex: 1,
          label: 'WENT_WELL',
          content: 'Deploys are faster after the pipeline refactor.',
          bgColor: '#bbf7d0',
          textColor: '#064e3b',
          rotation: -1,
          icon: 'thumb_up',
        },
        {
          id: 'retro-note-2',
          type: 'sticky-note',
          x: 560,
          y: 220,
          zIndex: 2,
          label: 'TO_IMPROVE',
          content: 'On-call handoff notes were unclear this sprint.',
          bgColor: '#fed7aa',
          textColor: '#7c2d12',
          rotation: 2,
          icon: 'priority_high',
        },
        {
          id: 'retro-note-3',
          type: 'sticky-note',
          x: 430,
          y: 420,
          zIndex: 3,
          label: 'ACTION_ITEM',
          content: 'Write a runbook for the on-call rotation.',
          bgColor: '#bfdbfe',
          textColor: '#1e3a8a',
          rotation: -2,
          icon: 'checklist',
        },
      ],
    },
  ];

  selectedWhiteboardId = this.whiteboards[0].id;

  private isPanning = false;
  private panStartScreen = { x: 0, y: 0 };
  private panStartOffset = { x: 0, y: 0 };

  private activeItem: WorkspaceCanvasItem | null = null;
  private dragOffset = { x: 0, y: 0 };
  private zIndexCounter = 100;

  get activeWhiteboard(): Whiteboard {
    return (
      this.whiteboards.find((board) => board.id === this.selectedWhiteboardId) ??
      this.whiteboards[0]
    );
  }

  get items(): WorkspaceCanvasItem[] {
    return this.activeWhiteboard.items;
  }

  onWhiteboardChange(id: string) {
    this.selectedWhiteboardId = id;
    this.activeItem = null;
    this.isPanning = false;
    this.resetView();
  }

  get canvasTransform(): string {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  get zoomPercent(): number {
    return Math.round(this.zoom * 100);
  }

  isDragging(item: WorkspaceCanvasItem): boolean {
    return this.activeItem === item;
  }

  trackByItemId(_index: number, item: WorkspaceCanvasItem): string {
    return item.id;
  }

  get minimapScaleX(): number {
    return this.miniMapRef.nativeElement.clientWidth / MINIMAP_WORLD_WIDTH;
  }

  get minimapScaleY(): number {
    return this.miniMapRef.nativeElement.clientHeight / MINIMAP_WORLD_HEIGHT;
  }

  get minimapViewportStyle() {
    const viewportEl = this.viewportRef.nativeElement;
    const visibleWidth = viewportEl.clientWidth / this.zoom;
    const visibleHeight = viewportEl.clientHeight / this.zoom;
    const visibleLeft = -this.panX / this.zoom;
    const visibleTop = -this.panY / this.zoom;

    return {
      left: `${visibleLeft * this.minimapScaleX}px`,
      top: `${visibleTop * this.minimapScaleY}px`,
      width: `${visibleWidth * this.minimapScaleX}px`,
      height: `${visibleHeight * this.minimapScaleY}px`,
    };
  }

  minimapItemStyle(item: WorkspaceCanvasItem) {
    return {
      left: `${item.x * this.minimapScaleX}px`,
      top: `${item.y * this.minimapScaleY}px`,
    };
  }

  minimapBlockClass(item: WorkspaceCanvasItem): string {
    if (item.type === 'sticky-note' || item.type === 'text') {
      return 'mini-map-block--sm';
    }
    if (item.type === 'code-snippet' || item.type === 'link') {
      return 'mini-map-block--wide';
    }
    return item.width >= item.height ? 'mini-map-block--wide' : 'mini-map-block--tall';
  }

  onMinimapMouseDown(event: MouseEvent) {
    event.stopPropagation();

    const rect = this.miniMapRef.nativeElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const worldX = clickX / this.minimapScaleX;
    const worldY = clickY / this.minimapScaleY;

    const viewportEl = this.viewportRef.nativeElement;
    this.panX = viewportEl.clientWidth / 2 - worldX * this.zoom;
    this.panY = viewportEl.clientHeight / 2 - worldY * this.zoom;
  }

  onCanvasMouseDown(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }
    this.isPanning = true;
    this.panStartScreen = { x: event.clientX, y: event.clientY };
    this.panStartOffset = { x: this.panX, y: this.panY };
  }

  onItemMouseDown(event: MouseEvent, item: WorkspaceCanvasItem) {
    event.stopPropagation();
    if (event.button !== 0) {
      return;
    }

    this.activeItem = item;
    item.zIndex = ++this.zIndexCounter;

    const canvasPoint = this.screenToCanvasPoint(event.clientX, event.clientY);
    this.dragOffset = { x: canvasPoint.x - item.x, y: canvasPoint.y - item.y };
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent) {
    if (this.activeItem) {
      const canvasPoint = this.screenToCanvasPoint(event.clientX, event.clientY);
      this.activeItem.x = canvasPoint.x - this.dragOffset.x;
      this.activeItem.y = canvasPoint.y - this.dragOffset.y;
      return;
    }

    if (this.isPanning) {
      this.panX = this.panStartOffset.x + (event.clientX - this.panStartScreen.x);
      this.panY = this.panStartOffset.y + (event.clientY - this.panStartScreen.y);
    }
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp() {
    this.isPanning = false;
    this.activeItem = null;
  }

  onWheelZoom(event: WheelEvent) {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1 + ZOOM_STEP : 1 - ZOOM_STEP;
    this.zoomAtPoint(this.zoom * factor, event.clientX, event.clientY);
  }

  zoomIn() {
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    this.zoomAtPoint(this.zoom + ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  zoomOut() {
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    this.zoomAtPoint(this.zoom - ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  resetView() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
  }

  private zoomAtPoint(nextZoom: number, clientX: number, clientY: number) {
    const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    const canvasX = (screenX - this.panX) / this.zoom;
    const canvasY = (screenY - this.panY) / this.zoom;

    this.panX = screenX - canvasX * clampedZoom;
    this.panY = screenY - canvasY * clampedZoom;
    this.zoom = clampedZoom;
  }

  private screenToCanvasPoint(clientX: number, clientY: number) {
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    return {
      x: (screenX - this.panX) / this.zoom,
      y: (screenY - this.panY) / this.zoom,
    };
  }
}
