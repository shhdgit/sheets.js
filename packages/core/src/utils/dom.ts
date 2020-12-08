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

export function setInputValue(el: HTMLInputElement, val: string) {
  el.value = val;
}

export function getInputValue(el: HTMLInputElement): string {
  return el.value;
}

export function addCssClass(element: HTMLElement, className: string) {
  if (!element || !className || className.length === 0) {
    return;
  }

  if (className.indexOf(' ') >= 0) {
    className.split(' ').forEach((value) => addCssClass(element, value));
    return;
  }

  if (element.classList) {
    element.classList.add(className);
  } else if (element.className && element.className.length > 0) {
    const cssClasses = element.className.split(' ');

    if (cssClasses.indexOf(className) < 0) {
      cssClasses.push(className);
      element.setAttribute('class', cssClasses.join(' '));
    }
  } else {
    element.setAttribute('class', className);
  }

  return element;
}

export function removeCssClass(element: HTMLElement, className: string) {
  if (!element || !className || className.length === 0) {
    return;
  }

  if (className.indexOf(' ') >= 0) {
    className.split(' ').forEach((value) => removeCssClass(element, value));
    return;
  }

  if (element.classList) {
    element.classList.remove(className);
  } else if (element.className && element.className.length > 0) {
    const newClassName = element.className
      .split(' ')
      .filter((c) => c !== className)
      .join(' ');

    element.setAttribute('class', newClassName);
  }
}

export function addOrRemoveCssClass(element: HTMLElement, className: string, addOrRemove: boolean) {
  if (addOrRemove) {
    addCssClass(element, className);
  } else {
    removeCssClass(element, className);
  }
}
