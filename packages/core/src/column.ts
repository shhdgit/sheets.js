import { COLUMN_FACTORY_TOKEN, COLUMN_TOKEN, ICellNode, IColumn, IndexValue } from './interface';
import { injectable, container } from './di';

@injectable()
export class Column implements IColumn {
  public index!: IndexValue;

  private children: ICellNode[] = [];

  constructor() {}

  public indexOf(index: number) {
    return this.children[index];
  }

  public push(child: ICellNode) {
    this.children.push(child);
  }

  public insert(index: number, child: ICellNode) {
    this.children.splice(index, 0, child);
  }

  public remove() {
    this.children.forEach((child) => child.remove());
  }
}

container.bind(COLUMN_TOKEN).to(Column).inTransientScope();
container.bind(COLUMN_FACTORY_TOKEN).toFactory((context) => (index: IndexValue) => {
  const columnNode = context.container.get(COLUMN_TOKEN) as Column;
  columnNode.index = index;
  return columnNode;
});
