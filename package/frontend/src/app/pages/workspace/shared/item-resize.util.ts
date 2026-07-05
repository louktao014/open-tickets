export type ResizeCorner = 'nw' | 'ne' | 'sw' | 'se';

export interface ResizeStart {
  x: number;
  y: number;
  width: number;
  height: number;
  itemX: number;
  itemY: number;
}

export interface ResizedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function startResize(event: MouseEvent, size: ResizedRect): ResizeStart {
  return {
    x: event.clientX,
    y: event.clientY,
    width: size.width,
    height: size.height,
    itemX: size.x,
    itemY: size.y,
  };
}

export function computeResizedRect(
  event: MouseEvent,
  corner: ResizeCorner,
  start: ResizeStart,
  zoom: number,
  minWidth: number,
  minHeight: number,
): ResizedRect {
  const deltaX = (event.clientX - start.x) / zoom;
  const deltaY = (event.clientY - start.y) / zoom;

  const isLeft = corner === 'nw' || corner === 'sw';
  const isTop = corner === 'nw' || corner === 'ne';

  const nextWidth = Math.max(minWidth, start.width + (isLeft ? -deltaX : deltaX));
  const nextHeight = Math.max(minHeight, start.height + (isTop ? -deltaY : deltaY));

  return {
    x: isLeft ? start.itemX + (start.width - nextWidth) : start.itemX,
    y: isTop ? start.itemY + (start.height - nextHeight) : start.itemY,
    width: nextWidth,
    height: nextHeight,
  };
}
