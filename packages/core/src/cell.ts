import { Component } from './component';
import { CellValue, ICellNode, ICellOptions } from './interface';
import { setElementText } from './utils';

export class CellNode extends Component implements ICellNode {
  static getTemplate() {
    return `<div class="sheetsjs-cell"></div>`;
  }

  public data: CellValue;

  constructor(parent: Component, public options: ICellOptions, defaultValue: CellValue = { value: null }) {
    super(parent, CellNode.getTemplate());
    this.data = defaultValue;
    (this.containerRef as any).__cellComponent = this;
  }

  public render() {
    const data = this.data.value !== null ? this.data.value : '';
    setElementText(this.containerRef, String(data));
    return this.containerRef;
  }

  public remove() {
    super.remove();
  }

  public update(data: CellValue) {
    this.data = data;
  }
}
