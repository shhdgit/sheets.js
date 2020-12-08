import { Component } from './component';
import { ICellNode, ICellOptions } from './interface';
import { setElementText } from './utils';

export class CellNode extends Component implements ICellNode {
  static getTemplate() {
    return `<div class="sheetsjs-cell"></div>`;
  }

  private data: string | number = '';

  constructor(parent: Component, public options: ICellOptions, defaultValue = '') {
    super(parent, CellNode.getTemplate());
    this.data = defaultValue;
  }

  public render() {
    if (!this.parent) {
      return;
    }
    setElementText(this.containerRef, String(this.data));
    return this.containerRef;
  }

  public remove() {
    this.unbindEvents();
    super.remove();
  }

  public update(data: string | number) {
    this.data = data;
  }

  private bindEvents() {}

  private unbindEvents() {}
}
