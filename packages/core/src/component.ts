import { insert, loadTemplate, remove, addEventListener, removeEventListener } from './utils';

const REF_ATTR = 'xs-ref';
const DEFAULT_CHILDREN_REF = 'children';

interface Listener {
  (event?: any): void;
}

export class Component {
  public children: Component[] = [];

  // wrapper element
  public containerRef!: HTMLElement;
  public childrenRef!: HTMLElement;
  public listeners: [string, Listener][] = [];

  constructor(protected parent: Component | null = null, template?: string) {
    if (template) {
      this.setTemplate(template);
      this.childrenRef = this.getRef(DEFAULT_CHILDREN_REF) as any;
      if (parent) {
        parent!.append(this.containerRef);
      }
    }
  }

  public setParent(parent: Component) {
    this.parent = parent;
  }

  // default render
  public render() {
    // remove children, then rerender
    const childrenRef = this.getChildrenRef();
    while (childrenRef.hasChildNodes()) {
      childrenRef.removeChild(childrenRef.lastChild!);
    }

    this.children.forEach((child) => {
      const childRef = child.render();
      childRef && this.append(childRef);
    });
    return this.containerRef;
  }

  public append(child: HTMLElement, refName?: string) {
    const childrenRef = refName ? this.getRef(refName) : this.getChildrenRef();
    childrenRef && insert(child, childrenRef as HTMLElement);
  }

  protected getRef(name: string) {
    return this.containerRef.querySelector(`[${REF_ATTR}="${name}"]`);
  }

  protected getChildrenRef() {
    return this.childrenRef || this.containerRef;
  }

  public setTemplate(template: string) {
    this.containerRef = loadTemplate(template);
    (this.containerRef as any).__defaultComponent = this;
  }

  public indexOf(index: number) {
    if (index < 0 || index >= this.children.length) {
      throw new Error(`Out of bounds`);
    }
    return this.children[index];
  }

  public push(child: Component) {
    this.children.push(child);
  }

  public insert(index: number, child: Component) {
    this.children.splice(index, 0, child);
    insert(child.containerRef, this.getChildrenRef(), this.children?.[index]?.containerRef);
  }

  public remove() {
    if (this.parent) {
      const index = this.parent.children.findIndex((child) => child === this);
      this.parent.children.splice(index, 1);
      remove(this.containerRef);
    }
  }

  public addEvent(event: string, listener: Listener) {
    this.listeners.push([event, listener]);
    addEventListener(this.containerRef, event, listener);
  }

  public dispose() {
    while (this.listeners.length) {
      const l = this.listeners.pop()!;
      removeEventListener(this.containerRef, l[0], l[1]);
    }
  }
}
