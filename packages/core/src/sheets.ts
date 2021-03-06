import { container as DIContainer } from './di';
import { CellNode } from './cell';
import { Component } from './component';
import { ROW_NODE_FACTORY_TOKEN, IRowNode, COLUMN_FACTORY_TOKEN, IColumn, ICellNode, IndexValue } from './interface';
import { addCssClass, removeCssClass, getCellForEvent } from './utils';
import { EditCell } from './edit_cell';

interface SheetsOptions {
  container: string | HTMLElement;
  row: number;
  column: number;
}

/**
 * type DOKMatrixItem = [row, column, value]
 */
type DOKMatrixItem = [number, number, string | number | null];

const defaultOptions: SheetsOptions = {
  container: '',
  row: 5,
  column: 26,
};

export class Sheets extends Component {
  static getTemplate() {
    return `<div class="sheetsjs"><div xs-ref="edit-cell"></div><div xs-ref="children" class="sheetsjs-container"></div></div>`;
  }

  private readonly options!: SheetsOptions;

  private rows!: IRowNode[];
  private columns!: IColumn[];
  private editCell = new EditCell();

  private rowNodeFactory = DIContainer.get(ROW_NODE_FACTORY_TOKEN);
  private columnNodeFactory = DIContainer.get(COLUMN_FACTORY_TOKEN);

  constructor(container: string | HTMLElement);
  constructor(options: SheetsOptions);
  constructor(container: string | HTMLElement | SheetsOptions) {
    super(new Component(null), Sheets.getTemplate());
    const isSheetsOption = (op: any): op is SheetsOptions => !!op.container;
    let options = { ...defaultOptions };
    if (isSheetsOption(container)) {
      options = { ...options, ...container };
    } else {
      options = { ...options, container };
    }
    this.options = options;

    const { container: _container } = this.options;
    const elRef = typeof _container === 'string' ? (document.querySelector(_container) as HTMLElement) : _container;
    if (!elRef) {
      throw new Error(`Can't find element, container id: ${_container}`);
    }
    this.parent!.containerRef = elRef;
    this.parent?.append(this.containerRef);

    this.rows = Array(options.row);
    this.columns = Array(options.column);
    this.children = this.rows;

    this.setup();
  }

  public render() {
    this.append(this.editCell.containerRef, 'edit-cell');
    return super.render();
  }

  public getRow(index: number): IRowNode {
    if (index < 0 || index >= this.rows.length) {
      throw new Error(`getRow: Out of bounds`);
    }
    return this.rows[index];
  }

  public getColumn(index: number): IColumn {
    if (index < 0 || index >= this.columns.length) {
      throw new Error(`getColumn: Out of bounds`);
    }
    return this.columns[index];
  }

  public getCell(rowIndex: number, colIndex: number): ICellNode {
    return this.getRow(rowIndex).indexOf(colIndex) as ICellNode;
  }

  public insertRow(index: number, before = true) {
    if (index < 0 || index >= this.rows.length) {
      throw new Error(`insertRow: Out of bounds`);
    }

    index = before ? index : index + 1;
    this.options.row++;

    const { column, row } = this.options;
    const rowIndex: IndexValue = { value: index };
    const rowNode = this.rowNodeFactory(this, rowIndex);
    this.rows.splice(index, 0, rowNode);
    for (let i = index + 1; i < row; i++) {
      this.rows[i].index.value = i;
    }

    for (let i = 0; i < column; i++) {
      const colIndex: IndexValue = this.columns[i].index;
      const cell = new CellNode(rowNode, { rowIndex, colIndex });

      rowNode.push(cell);
      this.columns[i].insert(index, cell);
    }
  }

  public insertColumn(index = 0, before = true) {
    if (index < 0 || index >= this.columns.length) {
      throw new Error(`insertColumn: Out of bounds`);
    }

    index = before ? index : index + 1;
    this.options.column++;

    const { column, row } = this.options;
    const colIndex: IndexValue = { value: index };
    const columnNode = this.columnNodeFactory(colIndex);
    this.columns.splice(index, 0, columnNode);
    for (let i = index + 1; i < column; i++) {
      this.columns[i].index.value = i;
    }

    for (let i = 0; i < row; i++) {
      const rowNode = this.rows[i];
      const rowIndex: IndexValue = rowNode.index;
      const cell = new CellNode(rowNode, { rowIndex, colIndex });

      columnNode.push(cell);
      this.rows[i].insert(index, cell);
    }
  }

  public removeRow(index: number) {
    if (index < 0 || index >= this.rows.length) {
      throw new Error(`removeRow: Out of bounds`);
    }
    this.rows[index].remove();
    for (; index < this.rows.length; index++) {
      this.rows[index].index.value--;
    }
  }

  public removeColumn(index: number) {
    if (index < 0 || index >= this.columns.length) {
      throw new Error(`removeColumn: Out of bounds`);
    }
    this.columns[index].remove();
    this.columns.splice(index, 1);
    for (; index < this.columns.length; index++) {
      this.columns[index].index.value--;
    }
  }

  public sort(col: number, compareFn?: (a: ICellNode, b: ICellNode) => number) {
    this.rows.sort(compareFn && ((a, b) => compareFn(a[col], b[col]))).forEach((row, i) => (row.index.value = i));
    this.render();
  }

  public getValue(): (string | number)[][] {
    const rst: (string | number)[][] = [];
    this.rows.forEach((row) => {
      const rowRst: (string | number)[] = [];
      rst.push(rowRst);
      row.children.forEach((cell) => rowRst.push(cell.getValue().value));
    });
    return rst;
  }

  public setValue(value: DOKMatrixItem[]) {
    // TODO: batch render
    this.resetValue();
    this.patchValue(value);
  }

  public patchValue(value: DOKMatrixItem[]) {
    value.forEach((v) => {
      const rowIndex = v[0];
      const colIndex = v[1];
      const data = v[2];
      const cell = this.getCell(rowIndex, colIndex);
      cell.setValue({ value: data });
      cell.render();
    });
  }

  public resetValue() {
    this.rows.forEach((row) =>
      row.children.forEach((cell: ICellNode) => {
        cell.setValue({ value: null });
        cell.render();
      }),
    );
  }

  private setup() {
    this.setupRowsAndColumns();
    this.setupCells();
    this.setupEvents();
  }

  private setupRowsAndColumns() {
    const { row, column } = this.options;
    for (let i = 0; i < row; i++) {
      this.rows[i] = this.rowNodeFactory(this, { value: i });
    }
    for (let i = 0; i < column; i++) {
      this.columns[i] = this.columnNodeFactory({ value: i });
    }
  }

  private setupCells() {
    const { row, column } = this.options;
    const cellNum = row * column;
    for (let i = 0, rowIndex = -1; i < cellNum; i++) {
      const colIndex = i % column;
      if (colIndex === 0) {
        rowIndex++;
      }

      const rowNode = this.rows[rowIndex];
      const columnController = this.columns[colIndex];
      const cell = new CellNode(rowNode, { rowIndex: rowNode.index, colIndex: columnController.index });

      rowNode.push(cell);
      columnController.push(cell);
    }
  }

  // TODO: emit sheets custom event
  private setupEvents() {
    // single selection
    const SELECTED_CLASS = 'sheetsjs-cell-selected';
    let selectedCell: ICellNode | null;
    this.addEvent('click', (e) => {
      if (selectedCell) {
        removeCssClass(selectedCell.containerRef, SELECTED_CLASS);
      }

      selectedCell = getCellForEvent(e);
      if (selectedCell) {
        addCssClass(selectedCell.containerRef, SELECTED_CLASS);
      }
    });

    // edit cell
    let originEditCell: ICellNode | null;
    this.addEvent('dblclick', (e) => {
      const currentCell = getCellForEvent(e);
      originEditCell = currentCell;

      if (currentCell?.getValue()) {
        this.editCell.setValue(currentCell.getValue());
      }
      this.editCell.show(currentCell?.containerRef.offsetTop, currentCell?.containerRef.offsetLeft);
    });
    this.addEvent('click', (e) => {
      const currentCell = getCellForEvent(e);
      if (!currentCell || !this.editCell.isDisplay) {
        return;
      }

      // save input value when hide
      this.editCell.hide();
      originEditCell?.setValue(this.editCell.getValue()!);
      originEditCell?.render();
      this.editCell.setValue(null);
    });
  }
}
