import { injectable, container } from './di';
import { Component } from './component';
import { ROW_NODE_TOKEN, ICellNode, ROW_NODE_FACTORY_TOKEN, IRowNode, IndexValue } from './interface';

@injectable()
export class RowNode extends Component implements IRowNode {
  static getTemplate() {
    return `<div class="sheetsjs-row"></div>`;
  }

  public index!: IndexValue;

  public children: ICellNode[] = [];

  constructor(parent: Component) {
    super(parent, RowNode.getTemplate());
  }

  public remove() {
    this.children.forEach((child) => child.remove());
    super.remove();
  }
}

container.bind(ROW_NODE_TOKEN).toConstructor(RowNode);
container.bind(ROW_NODE_FACTORY_TOKEN).toFactory((context) => (parent: Component, index: IndexValue) => {
  const rowNodeClass = context.container.get(ROW_NODE_TOKEN);
  const rowNode = new rowNodeClass(parent);
  rowNode.index = index;
  return rowNode;
});
