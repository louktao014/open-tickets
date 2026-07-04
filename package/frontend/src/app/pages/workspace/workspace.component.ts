import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StickyNoteComponent } from './sticky-note/sticky-note.component';
import { UploadedImageComponent } from './uploaded-image/uploaded-image.component';
import { CodeSnippetComponent } from './code-snippet/code-snippet.component';
import { TextComponent } from './text/text.component';
import { LinkComponent } from './link/link.component';
import { ToolHubsComponent } from './tool-hubs/tool-hubs.component';
import { EnumWorkspaceItemType } from '../../enum/workspace.enum';
import { Whiteboard, WorkspaceCanvasItem } from '../../interface/workspace.interface';
import { mockWorkspaces } from '../../mock/work-space';

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

  zoom = 0.5;
  panX = 0;
  panY = 0;
  EnumWorkspaceItemType = EnumWorkspaceItemType;

  whiteboards: Whiteboard[] = mockWorkspaces;

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

  onWhiteboardChange(id: string) {
    this.selectedWhiteboardId = id;
    this.activeItem = null;
    this.isPanning = false;
    this.resetView();
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
    this.zoom = 0.5;
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
