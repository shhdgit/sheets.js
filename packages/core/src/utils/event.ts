import { ICellNode } from '../interface';

export function getTarget(event: Event): HTMLElement {
  const eventNoType = event as any;

  return eventNoType.target || eventNoType.srcElement;
}

export function getCellForEvent(event: Event): ICellNode | null {
  let sourceElement: HTMLElement | null = getTarget(event);

  while (sourceElement) {
    const renderedCell = (sourceElement as any).__cellComponent;

    if (renderedCell) {
      return renderedCell as ICellNode;
    }

    sourceElement = sourceElement.parentElement;
  }

  return null;
}

export function addEventListener(element: HTMLElement, event: string, listener: (event?: any) => void) {
  element.addEventListener(event, listener);
}

export function removeEventListener(element: HTMLElement, event: string, listener: (event?: any) => void) {
  element.removeEventListener(event, listener);
}
