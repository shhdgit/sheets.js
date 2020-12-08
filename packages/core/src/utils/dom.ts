export function loadTemplate(template: string): HTMLElement {
  const tempDiv = document.createElement('div');

  tempDiv.innerHTML = (template || '').trim();

  return tempDiv.firstChild as HTMLElement;
}

export function remove(child: Element) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

export function insert(child: HTMLElement, parent: HTMLElement, anchor?: HTMLElement) {
  parent.insertBefore(child, anchor || null);
}

export function setElementText(el: HTMLElement, text: string) {
  el.textContent = text;
}
